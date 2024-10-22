import React, { useState, useCallback, useMemo } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CustomInput } from "@/components/chunks/CustomInput";
import { ColumnDef, SearchRateType } from "@/types";

// Group definitions for better organization
const agentCarrierColumns: ColumnDef[] = [
  { key: "agent_name", type: "text", label: "Agent Name" },
  { key: "agent_email", type: "email", label: "Agent Email" },
  { key: "company_name", type: "text", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  { key: "carrier_email", type: "email", label: "Carrier Email" },
  { key: "mc_number", type: "text", label: "MC" },
  { key: "home_city", type: "text", label: "Home City" },
];

const loadInfoColumns: ColumnDef[] = [
  { key: "posting", type: "checkbox", label: "Post" },
  { key: "dat_posting", type: "checkbox", label: "DAT" },
  { key: "call_driver", type: "checkbox", label: "Call" },
  { key: "pu_city", type: "text", label: "PU City" },
  { key: "destination", type: "text", label: "Dest" },
  { key: "pu_date_start", type: "date", label: "PU Start" },
  { key: "pu_date_end", type: "date", label: "PU End" },
  { key: "del_date_start", type: "date", label: "Del Start" },
  { key: "del_date_end", type: "date", label: "Del End" },
];

const rateInfoColumns: ColumnDef[] = [
  { key: "dead_head", type: "number", label: "DH" },
  { key: "min_miles", type: "number", label: "Min Mls" },
  { key: "max_miles", type: "number", label: "Max Mls" },
  { key: "rpm", type: "number", label: "RPM" },
  { key: "min_rate", type: "number", label: "Min Rate" },
  { key: "round_to", type: "number", label: "Round To" },
  { key: "extra", type: "number", label: "Extra" },
];

const truckDriverColumns: ColumnDef[] = [
  { key: "truck_type", type: { type: "truckTypeSelect", options: ["VH", "SB", "DD"] }, label: "Type" },
  { key: "truck_dims", type: "truckDims", label: "Dims" },
  { key: "payload", type: "number", label: "Payload" },
  { key: "accessories", type: "text", label: "Acc" },
  { key: "driver_name", type: "text", label: "Driver" },
  { key: "driver_lastname", type: "text", label: "Last Name" },
  { key: "driver_phone", type: "phone", label: "Phone" },
  { key: "driver_email", type: "email", label: "Email" },
  { key: "perks", type: "text", label: "Perks" },
];

interface GroupedData {
  agentInfo: {
    agent_name: string;
    company_name: string;
    data: SearchRateType[];
  };
}

const GroupedTable: React.FC<{ data: SearchRateType[] }> = ({ data }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Group data by agent and company
  const groupedData = useMemo(() => {
    const groups = data.reduce((acc, item) => {
      const key = `${item.agent_name}-${item.company_name}`;
      if (!acc[key]) {
        acc[key] = {
          agentInfo: {
            agent_name: item.agent_name,
            company_name: item.company_name,
            carrier_email: item.carrier_email,
            company_phone: item.company_phone,
            mc_number: item.mc_number,
            home_city: item.home_city,
          },
          data: [],
        };
      }
      acc[key].data.push(item);
      return acc;
    }, {} as Record<string, GroupedData>);
    return Object.values(groups);
  }, [data]);

  const toggleGroup = (key: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleRow = (key: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="space-y-4">
      {groupedData.map((group) => {
        const groupKey = `${group.agentInfo.agent_name}-${group.agentInfo.company_name}`;
        const isGroupExpanded = expandedGroups.has(groupKey);

        return (
          <Card key={groupKey} className="overflow-hidden">
            <div
              className="p-4 bg-gray-50 flex items-center cursor-pointer"
              onClick={() => toggleGroup(groupKey)}
            >
              {isGroupExpanded ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
              <div className="grid grid-cols-4 gap-4 flex-1">
                <div><strong>Agent:</strong> {group.agentInfo.agent_name}</div>
                <div><strong>Company:</strong> {group.agentInfo.company_name}</div>
                <div><strong>MC:</strong> {group.agentInfo.mc_number}</div>
                <div><strong>Phone:</strong> {group.agentInfo.company_phone}</div>
              </div>
            </div>

            {isGroupExpanded && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      {loadInfoColumns.map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.data.map((row) => {
                      const rowKey = `${row.search_id}`;
                      const isRowExpanded = expandedRows.has(rowKey);

                      return (
                        <React.Fragment key={rowKey}>
                          <TableRow>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(rowKey)}
                              >
                                {isRowExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </Button>
                            </TableCell>
                            {loadInfoColumns.map((col) => (
                              <TableCell key={col.key}>
                                <CustomInput
                                  columnDef={col}
                                  value={row[col.key as keyof SearchRateType]}
                                  onChange={(value) => handleUpdate(row.search_id, col.key, value)}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                          {isRowExpanded && (
                            <TableRow>
                              <TableCell colSpan={loadInfoColumns.length + 1}>
                                <div className="p-4 bg-gray-50">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Rate Information</h4>
                                      <div className="grid grid-cols-3 gap-2">
                                        {rateInfoColumns.map((col) => (
                                          <div key={col.key}>
                                            <label className="text-sm text-gray-500">{col.label}</label>
                                            <CustomInput
                                              columnDef={col}
                                              value={row[col.key as keyof SearchRateType]}
                                              onChange={(value) => handleUpdate(row.search_id, col.key, value)}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Truck & Driver Details</h4>
                                      <div className="grid grid-cols-3 gap-2">
                                        {truckDriverColumns.map((col) => (
                                          <div key={col.key}>
                                            <label className="text-sm text-gray-500">{col.label}</label>
                                            <CustomInput
                                              columnDef={col}
                                              value={row[col.key as keyof SearchRateType]}
                                              onChange={(value) => handleUpdate(row.search_id, col.key, value)}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default GroupedTable;