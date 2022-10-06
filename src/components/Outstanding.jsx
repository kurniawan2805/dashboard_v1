import { useState } from "react";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Link from "@mui/material/Link";
import Title from "./Title";

export default function ShowTableGrid({ outstanding }) {
  const [rows, setRows] = useState(outstanding);
  const [rowModesModel, setRowModesModel] = useState({});
  // const [rowId, setRowId] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log(rows);
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

  const mydate = new Date();

  const getIdle = (params) => {
    const order_date = new Date(params.row.order_date);
    const now = new Date();
    const diffDay = Math.round((now - order_date) / (1000 * 60 * 60 * 24) - 1);
    return order_date !== now ? `${diffDay} days` : "-";
  };

  const getStatus = (params) => {
    return params.row.submit_date != null
      ? "Submitted"
      : params.row.survey_date != null
      ? "Reviewed"
      : "";
  };

  const columns = [
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
      width: 100,
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
      field: "long_idle",
      headerName: "Idle",
      width: 70,
      editable: false,
      type: "date",
      headerAlign: "center",
      align: "center",
      valueGetter: getIdle,
      // valueFormatter: (params) => dayjs(params?.value).format('DD/MM/YYYY'),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      editable: true,
      type: "string",
      headerAlign: "center",
      align: "center",
      valueGetter: getStatus,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 120,
      editable: true,
      type: "string",
      headerAlign: "center",
      align: "center",
    },
  ];
  return (
    // <div style={{ width: "100%" }}>
    //   <Box
    //     sx={{
    //       height: 100,
    //       width: "100%",
    //       "& .actions": {
    //         color: "text.secondary",
    //       },
    //       "& .textPrimary": {
    //         color: "text.primary",
    //       },
    //     }}
    //   >

    <>
      <Title>Outstanding</Title>
      <DataGrid
        rows={rows}
        columns={columns}
        // editMode="row" // edit in row
        // rowModesModel={rowModesModel} // change mode of edit
        // onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        // onRowEditStart={handleRowEditStart}
        // onRowEditStop={handleRowEditStop}
        // experimentalFeatures={{ newEditingApi: true }}
        loading={!rows.length}
        rowHeight={30}
        // rowsPerPageOptions={[10, 15, 25, 50]}
        // pageSize={pageSize}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        sx={{ height: "100%", width: "100%", margin: "auto", my: 0 }}
      />
    </>
  );
}
