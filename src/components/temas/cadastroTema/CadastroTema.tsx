import React, { useState, useEffect, ChangeEvent } from 'react'
import { Container, Typography, TextField, Button } from "@material-ui/core"
import Tema from '../../../models/Tema';
import { buscaId, post, put } from '../../../services/Service';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify';
import './CadastroTema.css';
import { Box } from '@mui/material';


function CadastroTema() {

    let navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );
    const [tema, setTema] = useState<Tema>({
        id: 0,
        descricao: ''
    })

    useEffect(() => {
        if (token === "") {
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

    useEffect(() => {
        if (id !== undefined) {
            findById(id)
        }
    }, [id])

    async function findById(id: string) {
        buscaId(`/api/Temas/id/${id}`, setTema, {
            headers: {
                'Authorization': token
            }
        })
    }

    function updatedTema(e: ChangeEvent<HTMLInputElement>) {
        setTema({
            ...tema,
            [e.target.name]: e.target.value,
        })
    }

    async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("tema " + JSON.stringify(tema))

        if (id !== undefined) {
            put(`/api/Temas`, tema, setTema, {
                headers: {
                    'Authorization': token
                }
            })
            toast.success("Tema atualizado com sucesso", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                progress: undefined,
            })
        } else {
            post(`/api/Temas`, tema, setTema, {
                headers: {
                    'Authorization': token
                }
            })
            toast.success("Tema cadastrado com sucesso", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                progress: undefined,
            })
        }
        back()
    }

    function back() {
        navigate('/temas')
    }

    return (
        <Container maxWidth="sm" className="topo-cad-tema">
            <form onSubmit={onSubmit}>
                <Typography className='txt-cad-tema' variant="h3" color="textSecondary" component="h1" align="center" >Formulário de cadastro tema</Typography>
                <Box className='flex-cad-tema'>
                    <TextField className='input-cad-tema' value={tema.descricao} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedTema(e)} id="descricao" label="descrição do tema" variant="outlined" name="descricao" margin="normal" />
                    <Box className='button-cad-tema'>
                        <Button className="btn-cad-tema" type="submit" variant="contained" >
                            Finalizar
                        </Button>
                    </Box>
                </Box>
            </form>
        </Container>
    )
}

export default CadastroTema;