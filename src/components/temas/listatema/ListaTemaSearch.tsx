import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Tema from '../../../models/Tema';
import './ListaTema.css';
import { useNavigate } from 'react-router-dom';
import { busca } from '../../../services/Service';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify';

function ListaTemaSearch() {

    let navigate = useNavigate();
    const [temas, setTemas] = useState<Tema[]>([]);
    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );

    useEffect(() => {
        if (token == '') {
            toast.error("Calma aí! Você precisa estar logado!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                progress: undefined,
            })
            navigate("/login")
        }
    }, [token])


    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);

    async function fetchTemas() {
        await busca("/api/Temas/pesquisa", setData, {
            headers: {
                'Authorization': token
            }
        })
    }
    useEffect(() =>{
        fetchTemas()
        }, [])
       
    
    return (
        <>
            <Box>
                <input type="text" 
                placeholder='search...' className='search' 
                onChange={(e) => setQuery(e.target.value)}/>
            </Box>

            <Box className='temas-cx'>
                {

                    temas.filter((tema) =>
                    tema.descricao?.toLowerCase().includes(query)
                    ).map(tema => (

                        <Box m={2} className='tema-card2' >
                            <Card variant="outlined" className='tema-card' >
                                <Box className='position-card'>
                                    <CardContent  >
                                        <Typography gutterBottom>
                                            Tema
                                        </Typography>
                                        <Typography variant="h5" className='txt-tema' component="h2">
                                            {tema.descricao}
                                        </Typography>
                                    </CardContent>

                                    <CardActions >
                                        <Box display="flex" justifyContent="center" mb={1.5} className='btns-cx' >
                                            <Link to={`/formularioTema/${tema.id}`} className="text-decorator-none">
                                                <Box mx={1} className='button-list-tema' >
                                                    <Button variant="contained" className="btn-tema update" size='small'>
                                                        atualizar
                                                    </Button>
                                                </Box>
                                            </Link>
                                            <Link to={`/deletarTema/${tema.id}`} className="text-decorator-none">
                                                <Box mx={1} className='button-list-tema'>
                                                    <Button variant="contained" className="btn-tema delete" size='small'>
                                                        deletar
                                                    </Button>
                                                </Box>
                                            </Link>
                                        </Box>
                                    </CardActions>

                                </Box>
                            </Card>
                        </Box>
                    ))
                }

            </Box>
        </>
    );
}


export default ListaTemaSearch;