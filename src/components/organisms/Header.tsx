import { Text } from "@/components/atoms/Text";

/* Header Component with title and description */
export const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <header className="space-y-2 text-center">
      <Text variant="h1">{title}</Text>
      <Text variant="p">{description}</Text>
    </header>
  );
};
