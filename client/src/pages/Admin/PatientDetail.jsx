import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PatientDetail({ patientId, onClose, onUpdate }) {
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    segundoApellido: '',
    primerApellido: '',
    estadoCivil: '',
    genero: '',
    fechaNacimiento: '',
    edad: '',
    grupoSanguineo: '',
    dni: '',
    numSeguridadSocial: '',
    telefono: '',
    movil: '',
    aseguradora: '',
    numPoliza: '',
    numTarjeta: '',
    direccion: '',
    localidad: '',
    provincia: '',
    codigoPostal: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    axios.get(`/api/pacientes/${patientId}`)
      .then(res => {
        const p = res.data;
        // Map backend data to form fields
        setPatient(p);
        setForm({
          nombre: p.usuario_id?.nombre || '',
          segundoApellido: p.segundoApellido || '',
          primerApellido: p.primerApellido || '',
          estadoCivil: p.estadoCivil || '',
          genero: p.sexo || '',
          fechaNacimiento: p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toISOString().substr(0,10) : '',
          edad: p.edad || '',
          grupoSanguineo: p.grupoSanguineo || '',
          dni: p.usuario_id?.Rut || '',
          numSeguridadSocial: p.numSeguridadSocial || '',
          telefono: p.telefono || '',
          movil: p.movil || '',
          aseguradora: p.aseguradora || '',
          numPoliza: p.numPoliza || '',
          numTarjeta: p.numTarjeta || '',
          direccion: p.direccion || '',
          localidad: p.localidad || '',
          provincia: p.provincia || '',
          codigoPostal: p.codigoPostal || '',
          email: p.usuario_id?.email || ''
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar datos del paciente');
        setLoading(false);
      });
  }, [patientId]);

  const validate = () => {
    const e = {};
    if (!form.nombre) e.nombre = 'Nombre es obligatorio';
    if (!form.primerApellido) e.primerApellido = 'Primer apellido es obligatorio';
    if (!form.dni) e.dni = 'DNI es obligatorio';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    // Add more validations as needed
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      // Prepare data for backend update
      const updateData = {
        // Map form fields to backend schema
        usuario_id: patient.usuario_id._id,
        nombre: form.nombre,
        segundoApellido: form.segundoApellido,
        primerApellido: form.primerApellido,
        estadoCivil: form.estadoCivil,
        sexo: form.genero,
        fecha_nacimiento: form.fechaNacimiento,
        edad: form.edad,
        grupoSanguineo: form.grupoSanguineo,
        dni: form.dni,
        numSeguridadSocial: form.numSeguridadSocial,
        telefono: form.telefono,
        movil: form.movil,
        aseguradora: form.aseguradora,
        numPoliza: form.numPoliza,
        numTarjeta: form.numTarjeta,
        direccion: form.direccion,
        localidad: form.localidad,
        provincia: form.provincia,
        codigoPostal: form.codigoPostal,
        email: form.email
      };
      await axios.put(`/api/pacientes/${patientId}`, updateData);
      setSaving(false);
      if (onUpdate) onUpdate();
      if (onClose) onClose();
    } catch (err) {
      setError('Error al guardar los datos');
