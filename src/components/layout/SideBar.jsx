import React, {useState} from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/GroupAddRounded'
import DocumentIcon from '@mui/icons-material/DocumentScanner'
import PetitionerContainer from '../petitioner/PetitionerContainer';
import { useLocation, Link } from 'react-router-dom';
import BasicContainer from '../basic/BasicContainer';

const SideBar = () => {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
    setOpen(!open);
    };

const[petitioners, setPetitioners] = useState([])

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

const query = useQuery()


return (
    <div className="container">
        <div className="card" style={{marginBottom:0, borderRadius:0}}>
            <div className="card-body">
                <div className="row" style={{backgroundColor:' #FCFCFC'}}>
                    <div className="col-md-3 pt-5 sidebar-menu" style={{height:'100vh',padding:0}}>
                        <List   sx={{ width: '100%'}}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                style={{padding:0}}
                        >
                            <Link to="/filing?app=YwjNxt7v5T6EbRljBvcPbr2yh">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <SendIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Initial Input" />
                                </ListItemButton>
                            </Link>
                            <Link to="/filing?app=l4jt9wtolaast2kY9iPK61qcb">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <GroupIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Petitioners" />
                                </ListItemButton>
                            </Link>
                            <ListItemButton>
                                <ListItemIcon>
                                    <GroupIcon />
                                </ListItemIcon>
                                <ListItemText primary="Respondents" />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DocumentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Grounds" />
                            </ListItemButton>
                            <ListItemButton onClick={handleClick}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Previous Case Details" />
                            </ListItemButton>
                            <ListItemButton onClick={handleClick}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Advocate Details" />
                            </ListItemButton>
                            <ListItemButton onClick={handleClick}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Documents" />
                            </ListItemButton>
                            <ListItemButton onClick={handleClick}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Payment" />
                            </ListItemButton>
                            <ListItemButton onClick={handleClick}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="E File" />
                            </ListItemButton>
                        </List>
                    </div>
                    <div className="col-md-9 pt-5">
                        { query.get("cino")}
                        { query.get("app") === "YwjNxt7v5T6EbRljBvcPbr2yh" && (
                            <BasicContainer />
                        )}
                        { query.get("app") === "l4jt9wtolaast2kY9iPK61qcb" && (
                            <PetitionerContainer petitioners={petitioners} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

}

export default SideBar