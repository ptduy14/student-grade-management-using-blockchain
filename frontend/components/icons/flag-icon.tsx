interface Props {
    size?: number;
    fill?: string;
    width?: number;
    height?: number;
  }
  
  export const FlagIcon  = ({
    fill = "currentColor",
    size,
    height,
    width,
    ...props
  }: Props) => {
    return (
      <svg
        className="w-6 h-6 light:text-white dark:text-white"
        width={size || width || 24}
        height={size || height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z"
          fill={fill}
        />
      </svg>
    );
  };
  