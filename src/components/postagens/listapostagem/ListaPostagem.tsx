import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Postagem from '../../../models/Postagem';
import { busca } from '../../../services/Service'
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import './ListaPostagem.css';
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material';
import { useSelector } from "react-redux";
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify';
import axios from 'axios';

function ListaPostagem() {

    const [posts, setPosts] = useState<Postagem[]>([]);
    let navigate = useNavigate();
    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );

    useEffect(() => {
        if (token == "") {
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

    async function getPost() {
        await busca("/api/Postagens", setPosts, {
            headers: {
                'Authorization': token
            }
        })
    }

    useEffect(() => {

        getPost()

    }, [])


    const [query, setQuery] = useState("");


    return (
        <>

            <Box className='cx-search' >
                <div className="group">
                    <svg className="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
                    <input placeholder="Pesquisar postagem" type="search" className="input"
                        onChange={(e) => setQuery(e.target.value)} />
                </div>
            </Box>

            

            <Box className='posts-cx'>
                {posts.length === 0 ? (
                    <div>Nenhuma postagem encontrada</div>

                ) : (
                    posts.filter((post) =>
                        post.titulo?.toLowerCase().includes(query)
                    ).map(post => (
                        <Box m={2} key={post.id} >
                            <Card variant="outlined" className='card-post' >
                                <Box className='card-content-post' >
                                    <CardContent>
                                        <Typography variant="h5" component="h2" className='title-post' >
                                            {post.titulo}
                                        </Typography>
                                        <Typography variant="body2" component="p" className='content-post' >
                                            {post.descricao}
                                        </Typography>
                                        <Typography variant="body2" component="p" className='content-post'>
                                            Tema: {post.tema?.descricao}
                                        </Typography>
                                        <Typography variant="body2" component="p" className='content-post'>
                                            Autor: {post.criador?.nome}
                                        </Typography>
                                    </CardContent>
                                    <CardActions className='center' >
                                        <Box display="flex" justifyContent="center" mb={1.5}>

                                            <Link to={`/formularioPostagem/${post.id}`} className="text-decorator-none" >
                                                <Box mx={1}>
                                                    <Button variant="contained" className="button-post" size='small'>
                                                        atualizar
                                                    </Button>
                                                </Box>
                                            </Link>
                                            <Link to={`/deletarPostagem/${post.id}`} className="text-decorator-none">
                                                <Box mx={1}>
                                                    <Button variant="contained" className="button-post" size='small'>
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
    )
}

export default ListaPostagem;