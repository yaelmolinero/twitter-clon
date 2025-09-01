import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth.ts';
import { useLocation, useNavigate } from 'react-router';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';

import { api } from '@/lib/api-client.ts';
import { getCroppedImage } from '@/utils/cropImage.ts';

import type { Area } from 'react-easy-crop';
import type { ApiUserEditedResponse } from '@/types/api.d.ts';
import type { CoverType, LocationType, WebsiteType } from '@/types/types.d.ts';
import type { UserEditableState, EditProfileRenders, ToUploadType } from '@/types/users.d.ts';
type ComplementInfo = { cover: CoverType, location: LocationType, website: WebsiteType };

async function putProfile({ formData, token }: { formData: FormData, token: string }) {
  return await api.put<ApiUserEditedResponse>('/users/profile', formData, { auth: token });
}

export function useEditProfile() {
  const queryClient = useQueryClient();
  const { session } = useUser();
  const { setConfirmClose } = useModalClose();

  const navigate = useNavigate();
  const location = useLocation();
  const userFromLocation = (location.state as { user?: ComplementInfo })?.user ?? null;

  const [profile, setProfile] = useState<UserEditableState | null>(null);
  const initialInfo = useRef<UserEditableState>(null);

  const [render, setRender] = useState<EditProfileRenders>('general');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: putProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ type: 'all' });
      navigate(-1);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  useEffect(() => {
    if (!userFromLocation || !session?.user) return setProfile(null);

    const userComplement: UserEditableState = {
      ...session.user,
      ...userFromLocation
    };

    setProfile(userComplement);
    initialInfo.current = userComplement;

  }, [session, userFromLocation]);

  function handleChange(input: Partial<UserEditableState>) {
    setProfile(prev => {
      setConfirmClose(() => {
        if (!initialInfo.current || !profile) return true;

        const keys = Object.keys(initialInfo.current) as (keyof UserEditableState)[];
        let hasChanges = false;

        for (const key of keys) {
          if (profile[key] !== initialInfo.current[key]) {
            hasChanges = true;
            break;
          }
        }

        return hasChanges;
      });

      if (!prev) return null;
      return { ...prev, ...input };
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, toUpload: ToUploadType) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return console.error('Imagen mayor de 5MB');

    const image = URL.createObjectURL(file);
    setImageSrc(image);
    setRender(toUpload);
  }

  async function showCroppedImage() {
    if (!croppedAreaPixels || !imageSrc) return;

    try {
      const croppedImage = await getCroppedImage({ imageSrc, pixelCrop: croppedAreaPixels });
      if (!croppedImage) throw new Error('Error con la imagen');

      const isAvatar = render === 'avatar';
      const croppedImageUrl = URL.createObjectURL(croppedImage);
      const fileName = isAvatar ? 'avatar.jpg' : 'cover.jpg';
      const imageFile = new File([croppedImage], fileName, { type: croppedImage.type });

      if (isAvatar) handleChange({ avatar: croppedImageUrl, newAvatarFile: imageFile });
      else handleChange({ cover: croppedImageUrl, newCoverFile: imageFile, removeCover: false });
      setRender('general');

    } catch (err) { console.error(err); }
  }

  function removeCover(fn: () => void) {
    if (!profile || !initialInfo.current) return;
    fn();

    if (profile.newCoverFile) handleChange({ cover: initialInfo.current.cover });
    else handleChange({ cover: null, removeCover: true });
  }

  async function submitFn() {
    if (!profile || !session?.token || !initialInfo.current) return;

    const { newAvatarFile, newCoverFile, removeCover = false, ...comparableData } = profile;
    let hasChanges = false;
    const keys = Object.keys(comparableData) as (keyof typeof comparableData)[];
    const formData = new FormData();

    for (const key of keys) {
      if (profile[key] !== initialInfo.current[key]) {
        if (!hasChanges) hasChanges = true;

        if (key === 'avatar' && newAvatarFile) formData.append(key, newAvatarFile);
        else if (key === 'cover' && newCoverFile) formData.append(key, newCoverFile);
        else formData.append(key, profile[key] ?? 'null');
      }
    }

    if (removeCover) formData.append('removeCover', 'true');

    if (hasChanges) mutate({ formData, token: session.token });
    // if (hasChanges) {
    //   formData.forEach((value, key) => {
    //     console.log(key, value);
    //   });
    // }
  }

  return {
    profile,
    imageSrc,
    render,
    isPending,
    setRender,
    setCroppedAreaPixels,
    handleChange,
    handleFileChange,
    removeCover,
    showCroppedImage,
    submitFn
  };
}
