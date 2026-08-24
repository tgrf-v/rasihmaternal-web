import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface SelectContextType {
  value?: string | null;
  onValueChange?: (val: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLabel: string;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
  registerItem: (val: string, label: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export interface SelectProps {
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: { label: string; value: string | null }[];
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  onValueChange,
  children,
}) => {
  const [value, setValue] = React.useState<string | null>(controlledValue ?? null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string>("");
  const itemsMapRef = React.useRef<Record<string, string>>({});
  const containerRef = React.useRef<HTMLDivElement>(null);

  const registerItem = React.useCallback((val: string, label: string) => {
    itemsMapRef.current[val] = label;
    if (value === val || controlledValue === val) {
      setSelectedLabel(label);
    }
  }, [value, controlledValue]);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
      if (controlledValue && itemsMapRef.current[controlledValue]) {
        setSelectedLabel(itemsMapRef.current[controlledValue]);
      } else if (!controlledValue) {
        setSelectedLabel("");
      }
    }
  }, [controlledValue]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleValueChange = (val: string) => {
    setValue(val);
    if (itemsMapRef.current[val]) {
      setSelectedLabel(itemsMapRef.current[val]);
    }
    if (onValueChange) {
      onValueChange(val);
    }
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        isOpen,
        setIsOpen,
        selectedLabel,
        setSelectedLabel,
        registerItem,
      }}
    >
      <div className="relative w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select compound components must be used within a <Select>");
  }
  return context;
};

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect();
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition-all duration-200 focus:border-rose-500 outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 shadow-soft-sm text-left select-none",
          isOpen && "border-rose-500 ring-2 ring-rose-500/20",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180 text-rose-500"
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder = "Pilih..." }) => {
  const { selectedLabel } = useSelect();
  return (
    <span className={cn("truncate", !selectedLabel && "text-slate-400")}>
      {selectedLabel || placeholder}
    </span>
  );
};

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useSelect();

    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-soft-lg",
          !isOpen && "hidden pointer-events-none select-none",
          isOpen && "animate-scaleUp",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-1", className)} {...props} />
  )
);
SelectGroup.displayName = "SelectGroup";

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider", className)}
      {...props}
    />
  )
);
SelectLabel.displayName = "SelectLabel";

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onValueChange, setSelectedLabel, registerItem } = useSelect();
    const isSelected = value === itemValue;

    React.useEffect(() => {
      if (typeof children === "string") {
        registerItem(itemValue, children);
      }
    }, [itemValue, children, registerItem]);

    return (
      <div
        ref={ref}
        onClick={() => {
          if (onValueChange) onValueChange(itemValue);
          if (typeof children === "string") setSelectedLabel(children);
        }}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs md:text-sm font-medium transition-colors cursor-pointer select-none my-0.5",
          isSelected
            ? "bg-pink-50 text-rose-700 font-bold"
            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {isSelected && <Check className="h-4 w-4 text-rose-600 shrink-0 ml-2" />}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
};
