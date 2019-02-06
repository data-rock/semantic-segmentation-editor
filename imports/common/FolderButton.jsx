import React from 'react';
import {Button} from '@material-ui/core';


const goBack = () => window.history.back();
const FolderButton = () =>
    <div className="hflex flex-align-items-center">
        <Button onClick={goBack}>Back to folder</Button>
    </div>;

export default FolderButton;
