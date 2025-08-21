import { useState } from 'react';
import { ViewPasswordIcon } from '@/assets/icons';

interface Props {
  id: string;
  label: string;
  value: string;
  maxLength: number;
  onChange: (inputValue: string) => void;
  variant?: 'text' | 'email' | 'password' | 'textarea';
  hideFeedback?: boolean;
  autoComplete?: boolean;
  errorMsg?: string;
}

function InputForm({ id, label, value, maxLength, onChange, variant = 'text', hideFeedback = false, autoComplete = false, errorMsg = '' }: Props) {
  const isError = errorMsg !== '';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className='space-y-1'>
      <label className={`relative flex flex-col-reverse px-3 py-2 outline rounded-sm leading-4 ${!isError ? 'outline-borderColor focus-within:outline-2 focus-within:outline-twitterBlue transition-colors duration-200' : 'outline-red-500 outline-2'}`}>
        {variant !== 'textarea'
          ? <input
            type={variant === 'password' && isPasswordVisible ? 'text' : variant}
            id={id}
            name={id}
            value={value}
            placeholder={label}
            autoComplete={autoComplete ? 'on' : 'off'}
            maxLength={maxLength}
            className='peer w-full text-primary text-lg placeholder-transparent border-none outline-none'
            onChange={(e) => onChange(e.currentTarget.value)}
          />
          : <textarea
            id={id}
            name={id}
            value={value}
            placeholder={label}
            maxLength={maxLength}
            className='peer w-full text-primary text-lg placeholder-transparent border-none outline-none resize-none h-20 overflow-y-auto break-words'
            onChange={(e) => onChange(e.currentTarget.value)}
          ></textarea>
        }

        <div className={`text-end invisible ${!hideFeedback && 'peer-focus:visible'}`}>
          <span className='text-secondary text-sm'>{`${value.length} / ${maxLength}`}</span>
        </div>

        <div className={`absolute w-10/12 top-4 text-xl overflow-x-hidden ${!isError ? 'text-secondary peer-focus:text-twitterBlue' : 'text-red-500'} peer-focus:text-sm peer-focus:top-2 transition-all duration-200 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:top-2 pointer-events-none`}>
          <span className='overflow-hidden whitespace-nowrap text-ellipsis'>{label}</span>
        </div>

        {variant === 'password' && (
          <button
            type='button'
            className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'
            children={<ViewPasswordIcon className='text-primary size-5' isActive={isPasswordVisible} />}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        )}
      </label>

      {isError && <span className='block text-red-500 text-sm'>{errorMsg}</span>}
    </div>
  );
}

export default InputForm;
