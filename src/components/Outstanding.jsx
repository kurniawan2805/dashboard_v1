import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { GridRowModes, DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function ShowTableGrid({ outstanding }) {
  const [rows, setRows] = useState(offhire_db);
  const [rowModesModel, setRowModesModel] = useState({});
  // const [rowId, setRowId] = useState(null);
  const [pageSize, setPageSize] = useState(10);

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

  const columns = [
    {
      field: 'order_date',
      headerName: 'Order Date',
      width: 100,
      editable: true,
      type: 'date',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 70,
      headerAlign: 'center',
      align: 'center',
      editable: true,
    },
    {
      field: 'unit_no',
      headerName: 'Unit',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      editable: true,
    },
    {
      field: 'survey_type',
      headerName: 'Survey Type',
      width: 80,
      headerAlign: 'center',
      align: 'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['INS', 'OFF'],
    },
    {
      field: 'depot',
      headerName: 'Depot',
      width: 70,
      headerAlign: 'center',
      align: 'center',
      editable: true,
    },
    {
      field: 'survey_date',
      headerName: 'Survey Date',
      width: 100,
      editable: true,
      type: 'date',
      headerAlign: 'center',
      align: 'center',
      // valueFormatter: (params) => dayjs(params?.value).format('DD/MM/YYYY'),
    },
    {
      field: 'submit_date',
      headerName: 'Submit Date',
      width: 100,
      editable: true,
      type: 'date',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 100,
      editable: true,
      type: 'string',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
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
    <div style={{ width: '100%' }}>
      <Box
        sx={{
          height: 100,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row" // edit in row
          rowModesModel={rowModesModel} // change mode of edit
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          experimentalFeatures={{ newEditingApi: true }}
          loading={!offhire_db.length}
          rowHeight={35}
          rowsPerPageOptions={[10, 15, 25, 50]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sx={{ height: '98vh', width: '70vw', margin: 'auto', my: 1 }}
        />
      </Box>
    </div>
  );
}
