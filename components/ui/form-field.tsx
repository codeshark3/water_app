import { View, ViewProps } from "react-native";
import { Text } from "./text";
import { cn } from "~/lib/utils";

interface FormFieldProps extends ViewProps {
  label?: string;
  error?: string;
}

export function FormField({
  label,
  error,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <View className={cn("w-full mb-4", className)} {...props}>
      {label && (
        <Text variant="label" className="mb-2">
          {label}
        </Text>
      )}
      {children}
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
