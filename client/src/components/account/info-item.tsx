export function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-gray-400" />
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm font-semibold">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
}
