export const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <header className="space-y-2 text-center">
      <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">
        {title}
      </h1>
      <p className="text-sm text-gray-700 sm:text-base md:text-lg">
        {description}
      </p>
    </header>
  );
};
