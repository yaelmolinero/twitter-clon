import { useRef } from 'react';
import ProfileImage from '@/components/ui/ProfileImage.tsx';
import InputForm from '@/components/ui/InputForm.tsx';
import FloatButton from '@/components/ui/FloatButton.tsx';
import { CloseIcon, ImageUploadIcon } from '@/assets/icons';

import type { UserEditableState, ToUploadType } from '@/types/users.d.ts';

interface Props {
  profile: UserEditableState;
  handleChange: (newState: Partial<UserEditableState>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, toUpload: ToUploadType) => void;
  removeCover: (fn: () => void) => void;
}

function EditProfileForm({ profile, handleChange, handleFileChange, removeCover }: Props) {
  const avatarInputElement = useRef<HTMLInputElement>(null);
  const coverInputElement = useRef<HTMLInputElement>(null);

  const { cover, location, website, ...userBasic } = profile;
  const { name, bio } = userBasic;

  function handleRemoveCover() {
    removeCover(() => {
      if (coverInputElement.current) coverInputElement.current.value = '';
    });
  }

  return (
    <form className='pb-8' onSubmit={(e) => e.preventDefault()}>
      <input
        type='file'
        ref={avatarInputElement}
        accept='image/jpeg, image/png'
        onChange={(e) => handleFileChange(e, 'avatar')}
        hidden
      />
      <input
        type='file'
        ref={coverInputElement}
        accept='image/jpeg, image/png'
        onChange={(e) => handleFileChange(e, 'cover')}
        hidden
      />
      {/* Portada y foto de perfil */}
      <div className={`relative w-full h-[200px] ${!cover && 'bg-borderColor'}`}>
        {cover && (
          <div className='w-full h-full'>
            <img
              src={cover}
              alt='Imagen de portada'
              className='object-contain'
            />
          </div>
        )}
        <div className='absolute inset-0 flex justify-center items-center gap-6 bg-black/40'>
          <FloatButton
            ariaLabel='Cambiar portada'
            onClick={() => coverInputElement.current?.click()}
            icon={<ImageUploadIcon className='size-6 text-white' />}
          />

          {cover && (
            <FloatButton
              ariaLabel='Eliminar portada'
              onClick={handleRemoveCover}
              icon={<CloseIcon className='size-6 text-white' />}
            />
          )}
        </div>
      </div>

      <div className='px-4 py-3'>
        <div className='relative mb-10'>
          <div className='size-28 absolute left-0 -bottom-14 border-4 border-background rounded-full bg-[#f7f9f9] dark:bg-[#16181c]'>
            <ProfileImage user={{ ...userBasic, username: '' }} size='object-contain' disabled disableUserPopup />
          </div>

          <div className='flex justify-center items-center size-28 absolute left-0 -bottom-14 rounded-full bg-black/40'>
            <FloatButton
              ariaLabel='Cambiar imagen de perfil'
              onClick={() => avatarInputElement.current?.click()}
              icon={<ImageUploadIcon className='size-6 text-white' />}
            />
          </div>
        </div>
      </div>

      <div className='p-4 space-y-4'>
        <InputForm
          id='name'
          label='Nombre'
          value={name}
          maxLength={50}
          onChange={(inputValue) => handleChange({ name: inputValue })}
        />
        <InputForm
          variant='textarea'
          id='bio'
          label='Biografía'
          value={bio ?? ''}
          maxLength={160}
          onChange={(inputValue) => handleChange({ bio: inputValue })}
        />
        <InputForm
          id='location'
          label='Ubicación'
          value={location ?? ''}
          maxLength={30}
          onChange={(inputValue) => handleChange({ location: inputValue })}
        />
        <InputForm
          id='website'
          label='Sitio Web'
          value={website ?? ''}
          maxLength={100}
          onChange={(inputValue) => handleChange({ website: inputValue })}
        />
      </div>
    </form>
  );
}

export default EditProfileForm;
