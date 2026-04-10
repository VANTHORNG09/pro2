"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart3, Download, FileText, Users, Award } from 'lucide-react';

const mockReportData = [
  { class: 'CS 301', students: 28, assignments: 12, submissions: 336, avgGrade: 87.5, completionRate: 96 },
  { class: 'CS 202', students: 32, assignments: 10, submissions: 280, avgGrade: 82.3, completionRate: 91 },
  { class: 'CS 305', students: 25, assignments: 8, submissions: 175, avgGrade: 90.1, completionRate: 88 },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Platform-wide performance reports and analytics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl p-3 bg-blue-500/10 text-blue-500"><Users className="h-5 w-5" /></div><div><p className="text-2xl font-bold">1,234</p><p className="text-sm text-muted-foreground">Total Users</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-500"><FileText className="h-5 w-5" /></div><div><p className="text-2xl font-bold">456</p><p className="text-sm text-muted-foreground">Assignments</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl p-3 bg-violet-500/10 text-violet-500"><Award className="h-5 w-5" /></div><div><p className="text-2xl font-bold">3,892</p><p className="text-sm text-muted-foreground">Graded</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl p-3 bg-amber-500/10 text-amber-500"><BarChart3 className="h-5 w-5" /></div><div><p className="text-2xl font-bold">89.2%</p><p className="text-sm text-muted-foreground">Submission Rate</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle>Class Performance Report</CardTitle><CardDescription>Overview of class-level metrics.</CardDescription></div>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Avg Grade</TableHead>
                <TableHead>Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReportData.map((row) => (
                <TableRow key={row.class}>
                  <TableCell className="font-medium">{row.class}</TableCell>
                  <TableCell>{row.students}</TableCell>
                  <TableCell>{row.assignments}</TableCell>
                  <TableCell>{row.submissions}</TableCell>
                  <TableCell><Badge variant={row.avgGrade >= 85 ? 'default' : 'secondary'}>{row.avgGrade}%</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted"><div className={`h-full rounded-full ${row.completionRate >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${row.completionRate}%` }} /></div>
                      <span className="text-sm text-muted-foreground">{row.completionRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
