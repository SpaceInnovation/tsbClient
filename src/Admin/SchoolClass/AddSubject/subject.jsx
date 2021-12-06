import { Grid, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  deleteSchoolClass,
  patchSchoolClass,
  postSchoolClass,
} from "../../../actions/action_admin_school_class";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbar from "../../../components/Snackbar";
import TableCell from "@material-ui/core/TableCell";
import AddNew from "./modal";
import Table from "./table";
import { getFromLocalStorage } from "../../../helpers/browserStorage";
import { BACKEND_URL, API_KEY } from "../../../actions/api";
import Validator from "../../../helpers/validator";
import { fetchAllSchoolClasses } from "../../../actions/actions_admin_school";

const columnData = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    searchable: true,
  },
];

const properties = [
  {
    name: "name",
    component: true,
    padding: true,
    numeric: false,
    img: false,
  },
];

let filteredArray;

class School extends React.Component {
  state = {
    data: [],
    snackBarOpen: false,
    snackBarMessage: "",
    snackBarVariant: "error",
  };

  async componentDidMount() {
    const { fetchAllSchoolClasses } = this.props;
    const { match } = this.props;
    const { id } = match.params;
    console.log("id", id);
    await fetchAllSchoolClasses(id);
    this.fetchData();
  }

  componentWillReceiveProps(newProps) {
    const { fetchAllSchoolClasses } = newProps.school;
    const success = fetchAllSchoolClasses
      ? fetchAllSchoolClasses.success
      : null;
    if (success === false) {
      this.setState({
        snackBarOpen: true,
        snackBarVariant: "error",
        snackBarMessage: fetchAllSchoolClasses.message,
        loading: false,
      });
      return false;
    }
    if (
      Validator.propertyExist(newProps.school, "fetchAllSchoolClasses") &&
      typeof newProps.school.fetchAllSchoolClasses === "object"
    ) {
      setTimeout(() => {
        this.setState({
          data: fetchAllSchoolClasses.data,
        });
      }, 1000);
    } else return null;
  }

  componentDidUpdate(prevProps) {
    const { schoolClass } = this.props;
    if (
      schoolClass.deleteSchoolClass !== prevProps.schoolClass.deleteSchoolClass
    ) {
      const { deleteSchoolClass } = schoolClass;
      const { success } = deleteSchoolClass;
      if (success === false) {
        this.setState({
          snackBarOpen: true,
          snackBarVariant: "error",
          snackBarMessage: deleteSchoolClass.message,
          loading: false,
        });
        return false;
      }

      this.setState({
        data: filteredArray,
        snackBarOpen: true,
        snackBarVariant: "success",
        snackBarMessage: deleteSchoolClass,
        loading: false,
      });
    }
  }

  fetchData = () => {
    const { match } = this.props;
    const { id } = match.params;
    return fetch(`${BACKEND_URL}/schoolClasses/school/${id}/?key=${API_KEY}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${
          JSON.parse(getFromLocalStorage("tsb-login:admin")).token
        }`,
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          data: json ? json.data : null,
        });
        if (json.error) {
          throw json.error;
        }
      })
      .catch((error) => console.log(error));
  };

  handleDeleteClick = (schoolClassIDs) => {
    const { data } = this.state;
    const { deleteSchoolClass } = this.props;
    schoolClassIDs.forEach((schoolClassID, index) => {
      deleteSchoolClass(schoolClassID);
      filteredArray = data.filter(
        (datum) => schoolClassIDs.indexOf(datum._id) === -1
      );
    });
    this.setState({
      data: filteredArray,
    });
  };

  onCloseHandler = () => {
    this.setState({
      snackBarOpen: false,
    });
  };

  imagePanelDisplay = (n) => {
    return (
      <TableCell>
        <AddNew type="imageUpload" eachData={n} />
      </TableCell>
    );
  };

  editButtonDisplay = (n) => {
    const { patchSchoolClass, schoolClass } = this.props;
    return (
      <TableCell>
        <AddNew
          type="edit"
          eachData={n}
          schoolClass={schoolClass}
          patchSchoolClass={patchSchoolClass}
          fetchData={this.fetchData}
        />
      </TableCell>
    );
  };

  render() {
    const { data, snackBarOpen, snackBarMessage, snackBarVariant } = this.state;
    const { schoolClass, postSchoolClass, match } = this.props;
    const { id } = match.params;

    return (
      <Fragment>
        <Grid container>
          <AddNew
            type="add"
            data={data}
            schoolClass={schoolClass}
            postSchoolClass={postSchoolClass}
            fetchData={this.fetchData}
            id={id}
          />
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              color: "#2196f3",
            }}
          >
            <Typography variant="h5" component="h5">
              {/* {school.name} */}
            </Typography>
          </div>
        </Grid>
        <Grid container item xs={12} sm={12} md={12}>
          <div style={{ display: "flex" }}>
            <h4 style={{ marginRight: "10px" }}>List Of All Subjects</h4>
            <h3>{`[ ${data.length} ]`}</h3>
          </div>

          <Table
            columnData={columnData}
            data={data}
            properties={properties}
            id="_id"
            showSearch
            searchPlaceholder="Search Name of School"
            deleteItem={this.handleDeleteClick}
            editButton={this.editButtonDisplay}
            imagePanelDisplay={this.imagePanelDisplay}
          />
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackBarOpen}
            onClose={this.onCloseHandler}
          >
            <MySnackbar
              onClose={this.onCloseHandler}
              variant={snackBarVariant}
              message={snackBarMessage}
            />
          </Snackbar>
        </Grid>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  schoolClass: state.schoolClass,
  school: state.school,
});

const mapDispatchStateToProps = (dispatch) => ({
  // School
  fetchAllSchoolClasses: (id) => {
    dispatch(fetchAllSchoolClasses(id));
  },
  deleteSchoolClass: (id) => {
    dispatch(deleteSchoolClass(id));
  },
  patchSchoolClass: (data, id) => dispatch(patchSchoolClass(data, id)),
  postSchoolClass: (data, id) => {
    dispatch(postSchoolClass(data, id));
  },
});

export default connect(mapStateToProps, mapDispatchStateToProps)(School);
