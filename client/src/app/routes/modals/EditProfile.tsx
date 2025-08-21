import { useEditProfile } from '@/features/user/api/put-profile.ts';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose';
import ModalHeader from '@/components/ui/ModalHeader.tsx';

import EditProfileForm from '@/features/user/components/EditProfileForm.tsx';
import EditProfileCropper from '@/features/user/components/EditProfileCropper.tsx';
import UnsavedChangesModal from '@/components/ui/UnsavedChangesModal.tsx';

function EditProfile() {
  const {
    profile,
    imageSrc,
    render,
    setRender,
    handleChange,
    handleFileChange,
    removeCover,
    showCroppedImage,
    submitFn,
    setCroppedAreaPixels
  } = useEditProfile();
  const { handleCloseClick } = useModalClose();
  if (!profile) return null;

  return (
    <>
      <div className='w-full h-dvh flex justify-center items-center'>
        <div className='max-w-[600px] w-full h-[650px] bg-background rounded-2xl overflow-y-auto' onClick={(e) => e.stopPropagation()}>

          {render === 'general' && (
            <>
              <ModalHeader
                controlled
                render={render}
                handleClose={handleCloseClick}
                handleSubmit={submitFn}
              />

              <EditProfileForm
                profile={profile}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                removeCover={removeCover}
              />
            </>
          )}

          {(render === 'avatar' || render === 'cover') && (
            <div className='flex flex-col h-full'>
              <ModalHeader
                controlled
                render={render}
                handleClose={async () => setRender('general')}
                handleSubmit={showCroppedImage}
              />

              <EditProfileCropper
                toUpload={render}
                imageSrc={imageSrc as string}
                setCroppedAreaPixels={setCroppedAreaPixels}
              />
            </div>
          )}
        </div>
      </div>

      <UnsavedChangesModal variant='profile' />
    </>
  );
}

export default EditProfile;
