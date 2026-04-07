// app/(dashboard)/teacher/schedule/page.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, X, Calendar, Clock, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";

import { useClasses } from "@/lib/hooks/queries/useClasses";

interface ScheduleEntry {
  id: number;
  classId: number;
  className: string;
  classCode: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "lecture" | "lab" | "tutorial";
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const typeConfig = {
  lecture: { label: "Lecture", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  lab: { label: "Lab", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  tutorial: { label: "Tutorial", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
};

// Mock data
const mockSchedule: ScheduleEntry[] = [
  { id: 1, classId: 1, className: "CS101", classCode: "CS101", day: "Monday", startTime: "09:00", endTime: "10:30", room: "Room 201", type: "lecture" },
  { id: 2, classId: 1, className: "CS101", classCode: "CS101", day: "Wednesday", startTime: "09:00", endTime: "10:30", room: "Room 201", type: "lecture" },
  { id: 3, classId: 2, className: "CS202", classCode: "CS202", day: "Tuesday", startTime: "11:00", endTime: "12:30", room: "Lab 105", type: "lab" },
  { id: 4, classId: 2, className: "CS202", classCode: "CS202", day: "Thursday", startTime: "14:00", endTime: "15:30", room: "Room 303", type: "tutorial" },
  { id: 5, classId: 1, className: "CS101", classCode: "CS101", day: "Friday", startTime: "10:00", endTime: "11:30", room: "Lab 101", type: "lab" },
];

export default function TeacherSchedulePage() {
  const { data: classes = [] } = useClasses({});
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule);
  const [view, setView] = useState<"week" | "list">("week");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    classId: "",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    room: "",
    type: "lecture" as ScheduleEntry["type"],
  });

  const resetForm = () => {
    setFormData({ classId: "", day: "Monday", startTime: "09:00", endTime: "10:00", room: "", type: "lecture" });
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    if (!formData.classId || !formData.room) {
      alert("Please select a class and enter a room");
      return;
    }
    const cls = classes.find((c) => c.id.toString() === formData.classId);
    const newEntry: ScheduleEntry = {
      id: Date.now(),
      classId: parseInt(formData.classId),
      className: cls?.name ?? "Unknown",
      classCode: cls?.code ?? "Unknown",
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      type: formData.type,
    };
    setSchedule((prev) => [...prev, newEntry]);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this schedule entry?")) {
      setSchedule((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const totalHours = schedule.reduce((sum, s) => {
    const start = parseInt(s.startTime.split(":")[0]);
    const end = parseInt(s.endTime.split(":")[0]);
    return sum + (end - start);
  }, 0);

  return (
    <PageShell>
      <PageHeader
        title="Schedule"
        description="Manage your weekly teaching schedule and class timings."
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Sessions" value={schedule.length} subtitle="Per week" />
        <StatCard title="Teaching Hours" value={totalHours} subtitle="Hours per week" icon={<Clock className="h-4 w-4" />} />
        <StatCard title="Classes Scheduled" value={new Set(schedule.map((s) => s.classId)).size} subtitle="Unique classes" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Active Days" value={new Set(schedule.map((s) => s.day)).size} subtitle="Days per week" icon={<Calendar className="h-4 w-4" />} />
      </div>

      {/* View Toggle */}
      <div className="mb-4 flex gap-2">
        <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>Week View</Button>
        <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>List View</Button>
      </div>

      {view === "week" ? (
        /* Week View Grid */
        <SectionCard title="Weekly Schedule">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left text-sm">
              <thead className="border-b border-border/60">
                <tr>
                  <th className="px-3 py-3 font-medium">Time</th>
                  {DAYS.map((day) => (
                    <th key={day} className="px-3 py-3 font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot} className="border-b border-border/20">
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{slot}</td>
                    {DAYS.map((day) => {
                      const entry = schedule.find((s) => s.day === day && s.startTime === slot);
                      if (!entry) return <td key={day} className="px-3 py-2 text-xs text-muted-foreground/30">—</td>;
                      const typeConf = typeConfig[entry.type];
                      return (
                        <td key={day} className="px-3 py-2">
                          <div className={`rounded-md p-2 ${typeConf.color}`}>
                            <p className="text-xs font-semibold">{entry.className}</p>
                            <p className="text-[10px] opacity-80">{entry.room}</p>
                            <p className="text-[10px] opacity-80">{typeConf.label}</p>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="mt-1 text-[10px] underline opacity-60 hover:opacity-100"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : (
        /* List View */
        <SectionCard title="Schedule List">
          <div className="space-y-2">
            {schedule
              .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.startTime.localeCompare(b.startTime))
              .map((entry) => {
                const typeConf = typeConfig[entry.type];
                return (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-lg px-3 py-2 text-xs font-semibold ${typeConf.color}`}>
                        {typeConf.label}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.className} ({entry.classCode})</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.day}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {entry.startTime} - {entry.endTime}
                          </span>
                          <span>{entry.room}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(entry.id)}
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
          </div>
        </SectionCard>
      )}

      {/* Add Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Schedule Entry</h2>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sched-class">Class</Label>
                <select
                  id="sched-class"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.classId}
                  onChange={(e) => setFormData((p) => ({ ...p, classId: e.target.value }))}
                >
                  <option value="">Select a class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sched-day">Day</Label>
                <select
                  id="sched-day"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.day}
                  onChange={(e) => setFormData((p) => ({ ...p, day: e.target.value }))}
                >
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sched-start">Start Time</Label>
                  <Input
                    id="sched-start"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sched-end">End Time</Label>
                  <Input
                    id="sched-end"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData((p) => ({ ...p, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sched-room">Room</Label>
                <Input
                  id="sched-room"
                  value={formData.room}
                  onChange={(e) => setFormData((p) => ({ ...p, room: e.target.value }))}
                  placeholder="e.g., Room 201"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sched-type">Type</Label>
                <select
                  id="sched-type"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as ScheduleEntry["type"] }))}
                >
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleAdd}>Add Entry</Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
