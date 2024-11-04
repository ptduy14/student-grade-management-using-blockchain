import React from "react";

interface Props {
   size?: number;
   fill?: string;
   width?: number;
   height?: number;
}

export const UpdateIcon = ({ fill = "currentColor", size, width, height, ...props }: Props) => {
   return (
      <svg
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
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
         />
      </svg>
   );
};
