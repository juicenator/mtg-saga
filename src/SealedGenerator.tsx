import React, { useState, Component } from 'react';
import { LinearProgress, Select, MenuItem, FormControl } from '@material-ui/core';

const API_URL = "https://api.magicthegathering.io/v1/";

export type Set = {
    name: string,
    code: string,
    releaseDate: Date,
    block: string,
    onlineOnly: boolean,
    booster: any[],
    type:string,
}

const DEFAULT_VALUE = "Select a set"; 

export class SetComponent extends Component {
    state = {
        sets: [],
        selectedSet: "",
        validationError: "",
        loading: true
    }
    componentDidMount() {
        window.fetch(API_URL + "sets")
            .then((response) => {
                return response.json();
            })
            .then((res: any) => {
                let sorted = res.sets.sort((a: any, b: any) => a.releaseDate < b.releaseDate ? 1 : a.releaseDate > b.releaseDate ? -1 : 0)
                let setsFromApi = sorted.filter((set: Set) => {
                    return (set.type === "expansion");
                }).map((set: any) => {
                    return { value: set.code, display: set.name }
                });

                this.setState({
                    ...this.state,
                    sets: setsFromApi,
                    selectedSet: setsFromApi[0].value,
                    loading: false
                });
            }).catch(error => {
                console.log(error);
            });
    }

    render() {
        let tmpState = this.state;
        const message = !tmpState.loading ? (
         <FormControl>
            <Select 
                id="set-select"
                name="set-select"
                defaultValue={DEFAULT_VALUE}
                value={tmpState.selectedSet}
                onChange={e => {
                    console.log(e.target.value)
                    this.setState({
                        ...tmpState,
                        selectedSet: e.target.value,
                        validationError: (e.target.value === DEFAULT_VALUE) ? "You must select a set" : ""
                    });
                }}
            >
                {tmpState.sets.map((set: any) => <MenuItem key={set.value} value={set.value}>{set.display}</MenuItem>)}
            </Select>
            <div style={{ color: 'red', marginTop: '5px' }}>
                {tmpState.validationError}
            </div>
        </FormControl>) : <LinearProgress variant="query" />
        return message;
    }
}
