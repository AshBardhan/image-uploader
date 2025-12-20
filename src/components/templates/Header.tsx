export const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <header className="space-y-2 text-center">
      <h1 className="text-4xl font-bold text-gray-950">{title}</h1>
      <p className="text-gray-700">{description}</p>
    </header>
  );
};
