﻿import {tryLoginApi} from "../../api/loginApiClient.module";
import React, {FormEvent, useState} from "react";
import scss from "./LoginForm.module.scss";
import {useRouter} from "next/router";

interface LoginFormProps {
    userId: string;
    password: string;
    setUserId: (userId: string) => void;
    setPassword: (password: string) => void;
}

export function LoginForm(props: LoginFormProps): JSX.Element {

    const {userId, password, setUserId, setPassword} = props;
    const router = useRouter();

    function allCredentialsProvided(userId: string, password: string): boolean{

        if (password == "") {
            alert("You did not enter a password! please enter your password.");
            return false;
        }
        if (userId == "") {
            alert("You did not enter a User ID! Please enter your user ID.");
            return false;
        }
        return true;
    }

    function credentialsAreValid(statusCode: number): boolean {

        if (statusCode == 403) {
            alert("Those details are not in our system! Please try again");
            return false;
        }
        if (statusCode != 200) {
            alert("Something went wrong, please try again.");
            return false;
        }
        return true;
    }

    async function tryLogin(event: FormEvent): Promise<void> {
        //Validate Client Side
        if (allCredentialsProvided(props.userId, props.password)) {
            
            //Check api for credentials
            const apiStatusCode = await tryLoginApi(props.userId, props.password);
            
            //Validate Server Side
            credentialsAreValid(apiStatusCode) ? await router.push('/candidates') : {};
        }
        event.preventDefault();
    }

    return (
        <form onSubmit={tryLogin} className={scss.form}>
            <label className={scss.label}>
                User Id:
                <br/>
                <input
                    className={scss.input}
                    type={"text"}
                    value={props.userId}
                    onChange={event => props.setUserId(event.target.value)}
                />
            </label>
            <label className={scss.label}>
                Password:
                <br/>
                <input
                    className={scss.input}
                    type={"password"}
                    value={props.password}
                    onChange={event => props.setPassword(event.target.value)}
                />
            </label>
            <button className={scss.login} type="submit">Log In</button>
        </form>
    );
}