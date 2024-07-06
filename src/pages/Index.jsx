import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
          toast.success("CSV file uploaded successfully!");
        },
        header: true,
      });
    }
  };

  const handleEditCell = (rowIndex, columnIndex, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][columnIndex] = value;
    setCsvData(updatedData);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = csvData.length > 0 ? Object.keys(csvData[0]).reduce((acc, key) => ({ ...acc, [key]: "" }), {}) : {};
    setCsvData([...csvData, newRow]);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Management Tool</h1>
      <p className="mb-4">Upload, view, edit, and download CSV files.</p>

      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {fileName && <p className="mt-2">Uploaded File: {fileName}</p>}
      </div>

      {csvData.length > 0 && (
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(csvData[0]).map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((cell, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleEditCell(rowIndex, columnIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" onClick={handleAddRow} className="mt-4">
            Add Row
          </Button>
        </div>
      )}

      {csvData.length > 0 && (
        <Button variant="primary" onClick={handleDownload}>
          Download CSV
        </Button>
      )}
    </div>
  );
};

export default Index;