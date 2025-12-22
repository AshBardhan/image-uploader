import { Text } from "@/components/atoms/Text";

export const FilesErrorFallback = () => {
  return (
    <div
      className="p-4 bg-red-100 border border-red-400"
      role="alert"
      aria-live="assertive"
    >
      <Text variant="h4" role="alert" aria-live="assertive">
        Something went wrong.
      </Text>
      <Text variant="p">
        Please try refreshing the page or contact support if the issue persists.
      </Text>
    </div>
  );
};
