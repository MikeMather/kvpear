import { useApi } from "@/utils/api";
import Layout from "./layout";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ccn } from "@/styles/styleUtils";
import { useState } from "react";
import { LinkButton } from "@/components/common/LinkButton";

const schema = yup.object({
  email: yup.string().email().required(),
  message: yup.string().required(),
}).required();


export default function Contact() {
  const kvpearApiKey = process.env.NEXT_PUBLIC_KVPEAR_API_KEY as string;
  const kvpearApiUrl = process.env.NEXT_PUBLIC_KV_API_URL as string;
  const { post, isLoading, error: apiError, isDone } = useApi()
  const { handleSubmit, register, formState: { errors } } = useForm<{ email: string, message: string }>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { email: string, message: string }) => {
    const { email, message } = data;
    post(`${kvpearApiUrl}/kvs/contact/${email}`, message, {
      textBody: true,
      headers: {
        'x-api-key': kvpearApiKey,
        'Content-Type': 'text/plain'
      }
    });
  };

  if (isDone && !apiError) {
    return (<Layout>
      <div className="container grid-xs flex-col flex-center" style={{ height: '80vh' }}>
        <div className="hero" style={{ paddingTop: 0, paddingBottom: '40px' }}>
            <div className="hero-body text-center">
              <h1>Thank You!</h1>
              <p>We'll get back to you as soon as possible.</p>
            </div>
            <LinkButton href="/" className="btn-primary">Go Home</LinkButton>
          </div>
      </div>
    </Layout>)
  } 

  return (
    <Layout>
      <div className="container grid-xs" style={{ height: '80vh' }}>
        <div className="hero" style={{ paddingTop: 0, paddingBottom: '20px' }}>
          <div className="hero-body text-center">
            <i className="icon icon-mail icon-4x text-primary"></i>
            <h1>Contact Us</h1>
            <p>Send us a message and we'll get back to you as soon as possible.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={ccn('form-group', { 'has-error': !!errors?.email})}>
            <label className="form-label label-lg" htmlFor="email">Email</label>
            <input className="form-input input-lg" type="email" {...register('email', { required: true })} />
            {errors?.email && <p className="form-input-hint">{errors.email.message}</p>}
          </div>
          <div className={ccn('form-group', { 'has-error': !!errors?.message})}>
            <label className="form-label label-lg" htmlFor="email">Message</label>
            <textarea className="form-input input-lg" {...register('message', { required: true })} />
            {errors?.message && <p className="form-input-hint">{errors.message.message}</p>}
          </div>
          {apiError && <p className="text-error">{apiError}</p>}
          <button 
            type="submit" 
            className={`btn btn-primary btn-lg float-right ${isLoading && 'loading'}`}
          >
              Submit
          </button>
        </form>
      </div>
    </Layout>
  )
}