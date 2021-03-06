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
import axios from 'axios';

function ListaTema() {

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


    async function getTema() {
        await busca("/api/Temas", setTemas, {
            headers: {
                'Authorization': token
            }
        })
    }

    useEffect(() => {
        getTema()
    }, [])

    const [query, setQuery] = useState("");

    const handleReset = () => {
        getTema();
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        return await axios
            .get(`https://blogpessoalgen2.herokuapp.com/api/Temas/pesquisa?descricaoTema=${query}`, {
                headers: {
                    'Authorization': token
                }
            })
            .then((response) => {
                setTemas(response.data);
                setQuery("");
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            <Box className='cx-search'>
                <form onSubmit={handleSearch} className="group">
                    <input type="text"
                        placeholder='Pesquisar Tema' className="input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} />
                    <button type="submit">
                        <svg className="icon-tema" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
                    </button>

                    <button className="clear-btn" onClick={() => handleReset()}>Limpar</button>
                </form>
            </Box>

            <Box className='temas-cx'>
                {
                    temas.length === 0 ? (
                        <div>Nenhum tema encontrado</div>

                    ) : (temas.map(tema => (

                        <Box m={2} className='tema-card2' key={tema.id}>
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

                    )))
                }

            </Box>
        </>
    );

}

export default ListaTema;