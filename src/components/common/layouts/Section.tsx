/**
 * Interface for Section component props
 */
interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

/**
 *Gives a section styling inside the page to put components in
 * 
 * @component
 * @param {SectionProps} props - The component props
 * @returns {JSX.Element} A section element with the provided content
 * 
 */
const Section: React.FC<SectionProps> = ({ 
  className, 
  children, 
}): JSX.Element => {
  return (
    <section className={className}>
      {children}
    </section>
  );
};

export default Section;