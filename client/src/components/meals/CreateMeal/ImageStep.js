import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from "../../../config";
import placeholder from "../../../resources/wizard/image_placeholder.png";
import imageCompression from 'browser-image-compression';

const ImageStep = (props) => {

  const [state, updateState] = useState({ "file": placeholder });

  const getImage = e => {
    const files = e.target.files;
    try {
      const fileObj = files[0];
      console.log(`Uploading ${fileObj}.`);
      if (!fileObj) {
        console.error(`Error uploading ${fileObj}.`);
      }
      const path = URL.createObjectURL(fileObj);
      console.log(`Path: ${JSON.stringify(path)}`);

      updateState({ "file": path });

      submitFile(e, fileObj);
    }
    catch (err) {
      console.error(err);
    }
  };

  const submitFile = (event, file) => {
    event.preventDefault();

    var options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    props.setUploadingState(true);
    imageCompression(event.target.files[0], options)
      .then(function (compressedFile) {
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('uploader', props.form.host_id);
        axios.post(`${config.SERVER_HOST}/api/images/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            console.log(response.data);
            props.update({ "id": "image_id", "value": response.data });
          })
          .catch(function (error) {
            console.error(error);
          })
          .finally(() => {
            props.setUploadingState(false);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div className="wizard-container">

      <h3 style={{ marginLeft: "40px" }}>Image</h3>
      <div className="wizard-image-placeholder-containter"
        style={{
          backgroundImage: `url(${state.file})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "300px", height: "300px",
          border: "solid"
        }}>
        <Button
          variant="outlined"
          component="label">
          Add Photo <input
            type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={getImage}
          />
        </Button>
      </div>
    </div>
  );
};

export default ImageStep;