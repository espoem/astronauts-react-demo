import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { dateFormatter } from "../lib";
import { Astronaut } from "../types";
import DeleteAstronautDialog from "./DeleteAstronautDialog";

interface Data {
  id: number;
  name: string;
  surname: string;
  birthdate: string;
  superpowers: [number, string][];
  actions: string;
}

function createData(
  id: number,
  name: string,
  surname: string,
  birthdate: string,
  superpowers: [number, string][],
  actions: string = ""
): Data {
  return {
    id,
    name,
    surname,
    birthdate,
    superpowers,
    actions,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | [number, string][] },
  b: { [key in Key]: number | string | [number, string][] }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data | "actions";
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "surname",
    numeric: false,
    disablePadding: false,
    label: "Surname",
  },
  {
    id: "birthdate",
    numeric: false,
    disablePadding: false,
    label: "Birthdate",
  },
  {
    id: "superpowers",
    numeric: false,
    disablePadding: false,
    label: "Superpowers",
  },

  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ minWidth: headCell.id !== "actions" ? "12ch" : null }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function astronautsToTableData(astronauts: Astronaut[]): Data[] {
  return astronauts.map((astronaut) => {
    return createData(
      astronaut.id,
      astronaut.name,
      astronaut.surname,
      astronaut.birthdate,
      astronaut.superpowers.map((superpower) => [
        superpower.id,
        superpower.name,
      ])
    );
  });
}

type TableProps = {
  astronauts: Astronaut[];
};

export default function EnhancedTable({ astronauts }: TableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [astronautToDelete, setAstronautToDelete] = React.useState<
    number | null
  >(null);

  let [rows, setRows] = React.useState(astronautsToTableData(astronauts));

  const handleAstronautDelete = async (id: number) => {
    handleDialogClose();

    fetch(
      `https://fastify-rest-demo-production.up.railway.app/api/astronauts/${id}`,
      {
        method: "DELETE",
      }
    );

    setRows(rows.filter((row) => row.id !== id));
    // TODO: find better solution to avoid empty table page
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialogClose = () => {
    setAstronautToDelete(null);
    setModalOpen(false);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover tabIndex={-1} key={`ast-${row.id}`}>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.surname}</TableCell>
                        <TableCell align="left">
                          {dateFormatter.format(new Date(row.birthdate))}
                        </TableCell>
                        <TableCell align="left">
                          {row.superpowers?.length > 0 && (
                            <Paper
                              sx={{
                                display: "flex",
                                justifyContent: "start",
                                flexWrap: "wrap",
                                listStyle: "none",
                                p: 0.5,
                                m: 0,
                                gap: "8px",
                              }}
                              component="ul"
                              elevation={0}
                            >
                              {row.superpowers?.map(([id, name], idx) => {
                                return (
                                  <Chip
                                    label={name}
                                    component="li"
                                    key={`sup-${id}`}
                                  />
                                );
                              })}
                            </Paper>
                          )}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            <IconButton
                              color="default"
                              onClick={() =>
                                navigate(`/astronauts/${row.id}/edit`)
                              }
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setAstronautToDelete(row.id);
                                setModalOpen(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <DeleteAstronautDialog
        isOpen={modalOpen}
        onClose={handleDialogClose}
        onDelete={() => handleAstronautDelete(astronautToDelete as number)}
      />
    </>
  );
}
