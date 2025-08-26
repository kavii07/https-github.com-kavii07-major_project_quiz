import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:5000");

const QuizGame = () => {
    const { token, userId, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [scores, setScores] = useState({});
    const [opponentId, setOpponentId] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
        if (!token) navigate("/login");

        axios.post("http://localhost:5000/api/game/start", {}, { headers: { Authorization: token } })
            .then(response => {
                const session = response.data.session;
                setSessionId(session._id);
                socket.emit("user:register", userId);
                socket.emit("game:init", { sessionId: session._id });
            })
            .catch(() => logout());
    }, [token, navigate, logout]);

    useEffect(() => {
        const handleQuestionSend = (data) => {
            setQuestion(data.question);
            setTimeLeft(20);
        };

        const handleWaiting = () => setWaiting(true);

        const handleGameEnd = (data) => {
            setScores(data.scores || {});
            setWaiting(false);
            setQuestion(null);

            const opponent = Object.keys(data.scores || {}).find(id => id !== userId);
            setOpponentId(opponent || null);
        };

        socket.on("question:send", handleQuestionSend);
        socket.on("waiting", handleWaiting);
        socket.on("game:end", handleGameEnd);

        return () => {
            socket.off("question:send", handleQuestionSend);
            socket.off("waiting", handleWaiting);
            socket.off("game:end", handleGameEnd);
        };
    }, []);

    useEffect(() => {
        if (question) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 1) {
                        handleTimeout();
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [question]);

    const handleTimeout = () => {
        socket.emit("answer:submit", { sessionId, answer: null, userId });
    };

    const handleAnswer = (answer) => {
        socket.emit("answer:submit", { sessionId, answer, userId });
        setTimeLeft(20);
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container text-center mt-5">
                <h2 className="mb-4">Quiz Game</h2>
                {waiting ? (
                    <h3 className="text-warning">Waiting for other player to finish...</h3>
                ) : Object.keys(scores).length > 0 ? (
                    <div className="card p-4 shadow-sm bg-white text-dark">
                        <h3 className="text-danger">Game Over</h3>
                        <p className="fs-5">🎯 Your Score: <strong>{scores[userId] || 0}</strong></p>
                        <p className="fs-5">👥 Opponent Score: <strong>{opponentId ? scores[opponentId] || 0 : "Waiting for opponent..."}</strong></p>
                    </div>
                ) : question ? (
                    <div className="card p-4 shadow-sm bg-white text-dark">
                        <h3 className="mb-3">{question.questionText}</h3>
                        <p className="fs-5 text-primary">⏳ Time Left: {timeLeft}s</p>
                        <div className="d-grid gap-2">
                            {question.options.map((choice, index) => (
                                <button key={index} className="btn btn-outline-primary btn-lg" onClick={() => handleAnswer(choice)}>
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <h3 className="text-info">Waiting For Other Players to join</h3>
                )}
                <button className="btn btn-danger mt-4" onClick={logout}>Logout</button>
            </div>
        </div>
    );
    
};

export default QuizGame;
