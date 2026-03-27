interface NavSectionButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const NavSectionButton = ({
  onClick,
  className,
  children,
}: NavSectionButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
