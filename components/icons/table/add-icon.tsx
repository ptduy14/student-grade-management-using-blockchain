interface Props {
    size?: number;
    fill?: string;
    width?: number;
    height?: number;
 }
 
 export const AddIcon = ({ fill = "currentColor", size, height, width, ...props }: Props) => {
    return (
       <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          width={size || width || 24}
          height={size || height || 24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
       >
          <path
             stroke={fill}
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
       </svg>
    );
 };
 