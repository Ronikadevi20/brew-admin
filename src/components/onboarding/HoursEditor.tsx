import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OperatingHours } from "@/types/cafe.types";

interface HoursEditorProps {
  hours: OperatingHours[];
  onChange: (hours: OperatingHours[]) => void;
}

const timeOptions = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30", "23:00", "23:30", "00:00",
];

export function HoursEditor({ hours, onChange }: HoursEditorProps) {
  const updateDay = (index: number, updates: Partial<OperatingHours>) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], ...updates };
    onChange(newHours);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">Operating Hours</Label>
      <div className="space-y-2">
        {hours.map((day, index) => (
          <div
            key={day.day}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
          >
            <div className="w-24 flex-shrink-0">
              <span className="text-sm font-medium text-foreground">{day.day}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={!day.isClosed}
                onCheckedChange={(checked) => updateDay(index, { isClosed: !checked })}
              />
              <span className="text-xs text-muted-foreground w-12">
                {day.isClosed ? "Closed" : "Open"}
              </span>
            </div>
            
            {!day.isClosed && (
              <div className="flex items-center gap-2 flex-1">
                <Select
                  value={day.open}
                  onValueChange={(value) => updateDay(index, { open: value })}
                >
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time} className="text-xs">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-muted-foreground text-xs">to</span>
                
                <Select
                  value={day.close}
                  onValueChange={(value) => updateDay(index, { close: value })}
                >
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time} className="text-xs">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}