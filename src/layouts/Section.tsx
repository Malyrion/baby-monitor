/**
 * Interface for Section component props
 */
interface SectionProps {
  /** Optional className for styling the section */
  className?: string;
  /** Section content */
  children: React.ReactNode;
}

/**
 * Section component that wraps content in a semantic section element.
 * Provides a consistent way to structure page content.
 * 
 * @component
 * @param {SectionProps} props - The component props
 * @returns {JSX.Element} A section element with the provided content
 * 
 * @example
 * return (
 *   <Section className="my-section">
 *     <h2>Section Title</h2>
 *     <p>Section content</p>
 *   </Section>
 * )
 */
const Section: React.FC<SectionProps> = ({ 
  className, 
  children 
}): JSX.Element => {
  return (
    <section className={className}>
      {children}
    </section>
  );
};

export default Section;