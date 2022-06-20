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

    }, [posts.length])

    return (
        <>
            <Box className='posts-cx'>
                {
                    posts.map(post => (
                        <Box m={2} >
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
                                            {post.tema?.descricao}
                                        </Typography>
                                        <Typography variant="body2" component="p" className='content-post'>
                                            {post.criador?.nome}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
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
                    ))
                }
            </Box>
        </>
    )
}

export default ListaPostagem;