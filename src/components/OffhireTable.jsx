import { useState, useCallback } from "react";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Title from "./Title";

export default function OffhireTable({ offhire_db }) {
  const [rows, setRows] = useState(offhire_db);
  const [rowModesModel, setRowModesModel] = useState({});
  // const [rowId, setRowId] = useState(null);
  const [pageSize, setPageSize] = useState(50);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id, row) => () => {
    const editedRow = rows.find((row) => row.id === id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = useCallback(
    async (newRow) => {
      const response = await supabase
        .from("offhire_db")
        .update(newRow)
        .eq("id", newRow.id);
      // console.log(updatedDb);
      // alert("Updated");
      setSnackbar({ children: "User successfully saved", severity: "success" });
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      const updatedRow = { ...newRow, isNew: false };
      return response;
    },
    [rows]
  );

  // const processRowUpdate = React.useCallback(
  //   async (newRow) => {
  //     // Make the HTTP request to save in the backend
  //     const response = await mutateRow(newRow);
  //     setSnackbar({ children: "User successfully saved", severity: "success" });
  //     return response;
  //   },
  //   [mutateRow]
  // );

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const columns = [
    {
      field: "order_date",
      headerName: "Order Date",
      width: 100,
      editable: true,
      type: "date",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 70,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "unit_no",
      headerName: "Unit",
      width: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "survey_type",
      headerName: "Survey Type",
      width: 80,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: ["INS", "OFF"],
    },
    {
      field: "depot",
      headerName: "Depot",
      width: 70,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "survey_date",
      headerName: "Survey Date",
      width: 100,
      editable: true,
      type: "date",
      headerAlign: "center",
      align: "center",
      // valueFormatter: (params) => dayjs(params?.value).format('DD/MM/YYYY'),
    },
    {
      field: "submit_date",
      headerName: "Submit Date",
      width: 100,
      editable: true,
      type: "date",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inital_cost",
      headerName: "Initial Cost",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "final_cost",
      headerName: "Final Cost",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 100,
      editable: true,
      type: "string",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id, row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <>
      <Title>Offhire</Title>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row" // edit in row
        rowModesModel={rowModesModel} // change mode of edit
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate} // update data
        onProcessRowUpdateError={handleProcessRowUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
        loading={!rows.length}
        rowHeight={35}
        rowsPerPageOptions={[10, 15, 25, 50]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        sx={{ height: "93vh", width: "100%", margin: "auto" }}
      />
    </>
  );
}
