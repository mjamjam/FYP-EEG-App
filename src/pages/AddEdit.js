import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { db as firebaseDB } from "../firebase";
import { toast } from "react-toastify";
import "./AddEdit.css";

const initialState = {
  name: "",
  email: "",
  contact: "",
  abnormality: "",
  report: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});

  const { name, email, contact, abnormality, report } = state;

  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    firebaseDB.child("patients").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });

    return () => {
      setData({});
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id] });
    } else {
      setState({ ...initialState });
    }
  }, [id, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !abnormality || !report) {
      toast.error("Please provide value into each input field");
    } else {
      if (!id) {
        firebaseDB.child("patients").push(state, (err) => {
          console.log("state", state);
          if (err) {
            toast.error(err);
          } else {
            toast.success("Patient Added Successfully");
          }
        });
      } else {
        firebaseDB.child(`patients/${id}`).set(state, (err) => {
          console.log("state", state);
          if (err) {
            toast.error(err);
          } else {
            toast.success("Patient Updated Successfully");
          }
        });
      }
      setTimeout(() => history.push("/"), 500);
    }
  };
  return (
    <div style={{ marginTop: "100px" }}>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">
          <strong>Name</strong>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Patient Name ..."
          value={name || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="email">
          <strong>Email</strong>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Patient Email ..."
          value={email || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="contact">
          <strong>Contact</strong>
        </label>
        <input
          type="number"
          id="contact"
          name="contact"
          placeholder="Patient Contact No ..."
          value={contact || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="abnormality">
          <strong>Abnormality</strong>
        </label>
        <input
          type="text"
          id="abnormality"
          name="abnormality"
          placeholder="Normal, Slowing or Spiked ..."
          value={abnormality || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="contact">
          <strong>Report</strong>
        </label>
        <br />
        <input
          type="file"
          id="report"
          name="report"
          value={ id ? null : report}
          onChange={handleInputChange}
        />
        <input type="submit" value={id ? "Update" : "Save"} />
      </form>
    </div>
  );
};

export default AddEdit;
