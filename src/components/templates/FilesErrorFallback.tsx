import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";

/* Fallback Component to display error message when file operations fail */
export const FilesErrorFallback = () => {
  return (
    <Card theme="error" role="alert" aria-live="assertive">
      <Text variant="h4">Something went wrong.</Text>
      <Text variant="p">
        Please try refreshing the page or contact support if the issue persists.
      </Text>
    </Card>
  );
};
