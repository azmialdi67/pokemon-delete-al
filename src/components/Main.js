/** @format */

import React, { useEffect, useState } from "react";
import Pokemon from "./Pokemon";
import axios from "axios";
import HubungiKamiForm from "./HubungiKamiForm";

function Main() {
  const serverHost = "http://localhost:5000";
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    axios
      .get(serverHost + "/pokemon", {
        "Access-Control-Allow-Origin": "*",
      })
      .then((res) => {
        const dataArray = [];
        res.data.records.map((item) => {
          console.log(item._fields[0]);
          dataArray.push(item._fields[0]);
          setPokemons(dataArray);
        });
      });
  }, []);

  let modalTambahPokemon = "";
  if (isOpen) {
    modalTambahPokemon = (
      <div className="modal">
        <div className="modal-inner">
          <div className="modal-header"></div>
          <div className="modal-introduction">
            <form
              onSubmit={(event) => {
                handleSubmit(event);
              }}>
              <p>Nama</p>
              <input
                required
                type={"text"}
                value={nama}
                onChange={(event) => {
                  setNama(event.target.value);
                }}
              />

              <p>Deskripsi</p>
              <textarea
                required
                value={deskripsi}
                onChange={(event) => {
                  setDeskripsi(event.target.value);
                }}
              />

              <p>Upload File:</p>
              <input
                required
                className={"form-input-file"}
                type={"file"}
                accept={".png"}
                onChange={(event) => {
                  handleFileSelected(event);
                }}
              />
              <input
                style={{ marginTop: "10px" }}
                type={"submit"}
                value={"Simpan"}
              />
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                style={{ marginTop: "10px" }}>
                Tutup
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function handleFileSelected(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    axios.post(serverHost + "/pokemon", formData).then((res) => {
      setPokemons(res.data);
      setIsOpen(!isOpen);
    });
    window.location.reload();
  }

  function handleClickTambah() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="main-wrapper">
      <div className="main">
        <div className="hello-container">
          <h1>Hello, Pokemon hunter</h1>
          <h2>Selamat datang di dunia</h2>
        </div>
        <div className="pokemon-container">
          <button
            onClick={() => {
              handleClickTambah();
            }}>
            Tambah Pokemon
          </button>
          <h3>List Pokemon</h3>
          <div className="list-card">
            {pokemons.map((pokemon, index) => {
              return (
                <Pokemon
                  key={index}
                  nama={pokemon.nama}
                  image={serverHost + pokemon.path}
                  deskripsi={pokemon.deskripsi}
                />
              );
            })}
          </div>
        </div>
        {/*Masukkan komponen HubungiKamiForm.js di bawah ini*/}
        <div className="hubungikami-container">
          <h3>Hubungi Kami</h3>
          <HubungiKamiForm />
        </div>
      </div>
      {modalTambahPokemon}
    </div>
  );
}

export default Main;
