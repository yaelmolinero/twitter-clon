import { useState, useRef } from 'react';
import { useUser } from '@/hooks/useAuth.ts';
import { paths } from '@/config/paths.ts';
import { Link, useLocation } from 'react-router';

import Divisor from '@/components/ui/Divisor.tsx';
import CircularProgress from '@/components/ui/CircularProgress.tsx';
import ProfileImage from '@/components/ui/ProfileImage.tsx';

import type { NewPostState } from '@/types/tweets.d.ts';

import { CloseIcon, ImageIcon, PlusIcon } from '@/assets/icons';
type TypeFormVariant = 'create' | 'reply' | 'replyInModal' | 'thread';

interface ThreadProps {
  isMoreThanOne: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  addTweetOnThread: () => void;
  removeTweetOnThread: () => void;
  focusOnThread: () => void;
}

interface Create extends NewPostState, Partial<ThreadProps> {
  type: 'create' | 'reply' | 'replyInModal';
  handleChange: (input: NewPostState) => void;
}

interface Thread extends NewPostState, ThreadProps {
  type: 'thread';
  handleChange: (input: NewPostState) => void;
}

const MAX_LENGTH = 250;
function getPlaceholders(type: TypeFormVariant, isMoreThanOne: boolean): { inputPlaceholder: string, btnSubmitText: string } {
  if (type === 'reply' || type === 'replyInModal') return { inputPlaceholder: 'Postea tu respuesta', btnSubmitText: 'Responder' };
  if (type === 'thread' && isMoreThanOne) return { inputPlaceholder: 'Añadir otro post', btnSubmitText: 'Postear todo' };
  return { inputPlaceholder: '¿Qué estas pensando?', btnSubmitText: 'Postear' };
}

function TweetForm({ type, content, file, image, addTweetOnThread, removeTweetOnThread, handleChange, focusOnThread, isMoreThanOne = false, isDisabled = false, isFocused = false }: Create | Thread) {
  const location = useLocation();
  const { session } = useUser();
  const [isVisited, setIsVisited] = useState(type !== 'reply');
  const fileInputElement = useRef<HTMLInputElement>(null);

  const isThread = type === 'thread';
  const { inputPlaceholder, btnSubmitText } = getPlaceholders(type, isMoreThanOne);

  if (!session?.user) return null;

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    handleChange({ content: e.target.value, image, file });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return;

    const image = URL.createObjectURL(file);

    handleChange({ content, image: image, file: file });
  }

  function removeImage() {
    if (fileInputElement.current) fileInputElement.current.value = '';
    handleChange({ content, image: null, file: undefined });
  }

  function handleFocus() {
    if (isThread && !isFocused) focusOnThread();
    if (!isVisited) setIsVisited(true);
  }

  return (
    <div className={`flex gap-2 px-4 py-3 w-full ${!isVisited && 'pb-8'} ${isThread && 'opacity-50 transition-opacity duration-100'} ${isFocused && 'opacity-100'}`} onClick={handleFocus}>
      <ProfileImage user={session.user} size='size-10' disabled disableUserPopup />

      <div className='flex-1 mt-1 relative'>
        <div className={`${!isVisited && 'flex justify-between'}`}>
          <textarea
            value={content}
            placeholder={inputPlaceholder}
            maxLength={MAX_LENGTH}
            className={`w-full resize-none field-sizing-content border-none outline-none font-normal text-xl text-primary break-word-legacy placeholder:text-secondaryText ${(type === 'replyInModal' || isThread && isFocused && !image) && 'min-h-[4em]'}`}
            onChange={handleContentChange}
            autoFocus={isFocused || type === 'replyInModal'}
          ></textarea>
          {image && (
            <div className="relative mt-2 mb-4">
              <img
                src={image}
                alt="Previsualización de la imagen"
                className="w-full object-cover rounded-2xl"
              />
              {(!isThread || isFocused) && (
                <button
                  type="button"
                  onClick={removeImage}
                  aria-label='Remover imagen del post'
                  className="absolute top-2 right-2 p-1 rounded-full text-white bg-black/50 cursor-pointer"
                  children={<CloseIcon className='size-5' />}
                />
              )}
            </div>
          )}

          {!isVisited && (
            <button
              type="button"
              disabled
              aria-label='Este boton no hace nada'
              className="font-bold px-4 py-1.5 rounded-full cursor-pointer text-buttonText bg-primary hover:opacity-95 disabled:opacity-50 disabled:cursor-default"
            >Responder</button>
          )}
        </div>

        {(content.length > 0 && isFocused) && <Divisor />}

        {(!isThread || isFocused) && (
          <div className={`flex justify-between mt-3 ${!isVisited && 'hidden'}`}>
            <div className="flex items-center *:cursor-pointer">
              <button
                type="button"
                onClick={() => fileInputElement.current?.click()}
                className="p-2 rounded-full text-twitterBlue hover:bg-commentHover/10 transition-colors duration-200"
              >
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  ref={fileInputElement}
                  onChange={handleImageChange}
                  hidden
                />
                <ImageIcon className="size-5" />
              </button>
              {/* <button
                type='button'
                className='p-2 rounded-full text-twitterBlue hover:bg-commentHover/10 transition-colors duration-200'>
                <GifIcon className='size-5' />
              </button> */}
            </div>

            <div className='flex items-center gap-3'>
              {(content.length > 0 || image != null) && (
                <div className='flex items-center gap-3'>
                  <CircularProgress value={content.length} max={MAX_LENGTH} className="rotate-[-90deg] size-7 text-borderColor" />
                  {(type !== 'reply' && type !== 'replyInModal') && (
                    <>
                      <div className="h-8 w-[1px] bg-borderColor"></div>
                      {!isThread ? (
                        <Link
                          to={paths.app.post.getHref()}
                          state={{ backgroundLocation: location, post: { content, image, file } }}
                          className='rounded-full p-1 border-1 border-borderColor hover:bg-hoverColor'
                          aria-label='Crear hilo'
                          onClick={() => handleChange({ content: '', file: undefined, image: null })}
                          children={<PlusIcon className='size-4 text-twitterBlue' />}
                        />
                      ) : (
                        <button
                          type='button'
                          className='rounded-full p-1 border-1 border-borderColor cursor-pointer hover:bg-hoverColor'
                          aria-label='Agregar post al hilo'
                          children={<PlusIcon className='size-4 text-twitterBlue' />}
                          onClick={(e) => {
                            e.stopPropagation();
                            addTweetOnThread();
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="font-bold px-4 py-1.5 rounded-full cursor-pointer text-buttonText bg-primary hover:opacity-95 disabled:opacity-50 disabled:cursor-default"
                disabled={content.length === 0 && !image || isDisabled}
              >
                {btnSubmitText}
              </button>
            </div>
          </div>
        )}

        {(isThread && isFocused && isMoreThanOne && !content && !image) && (
          <button
            type='button'
            onClick={removeTweetOnThread}
            className='absolute right-0 top-0 p-1 rounded-full cursor-pointer hover:bg-commentHover/10 transition-colors duration-100'
            children={<CloseIcon className='size-4 text-twitterBlue' />}
          />
        )}
      </div>
    </div>
  );
}

export default TweetForm;
