import React, { useState, useContext, useCallback ,useEffect} from 'react';
import {useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import { Tiled } from '@blueskyproject/finch';

const ReportDataPage=()=>{

    return(
        <Tiled tiledBaseUrl='http://localhost:8000/api/v1'></Tiled>
    );

}

export default ReportDataPage;