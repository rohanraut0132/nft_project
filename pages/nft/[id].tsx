import React from 'react'
import { ConnectWallet,useDisconnect, useAddress,useMetamask } from "@thirdweb-dev/react"
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection} from '../../typings';
import Link from 'next/link';

interface Props{
  collection:Collection
      
}

function NFTDropPage({collection}:Props) {
  //Auth
  const connectWithMetamask =useMetamask();
  const address =useAddress();
  const disconnect=useDisconnect();
  //---
console.log(address)

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
{/* left */}

<div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
  <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'> <div className='bg-gradient-to-br rounded-xl from-yellow-400 to-purple-600 p-2'> <img  className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' src={urlFor(collection.previewImage).url()} alt=""/></div> 
<div className='space-y-2 p-5 text-center '>
    <h1 className='text-4xl font-bold text-white'>{}</h1>
    <h2 className='text-xl text-gray-300'>this is the text of h2</h2>
    </div>
</div>
</div>

{/* right */}

<div className='flex flex-1 flex-col p-12 lg:col-span-6'>
  {/* {header} */}

  <header className='flex items-center justify-between'>
    <Link href={'/'}>
    <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80 '>
      the {''}
      <span className='font-extrabold underline decoration-pink-600/50'>papafam</span>{''}
       nft market place
    </h1>
    </Link>
    <button onClick={() => (address ? disconnect() : connectWithMetamask())} className='rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base'>{address ? 'Sign Out' : 'Sign-in'}</button>
  </header>  
  <hr className='my-2 border' />
  {address && <p className='text-center text-sm text-rose-400'>
    You are login with wallet {address.substring(0,8)}...{address.substring(address.length-5)}</p>}

  {/* {content} */}
  <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center'>
    <img className='w-80 object-cover pb-10 lg:h-60' src={urlFor(collection.mainImage).url()} alt=""/>
    <h1 className='text-3xl font-bold lg:text-5xl'>{collection.title}</h1>
    <p className='pt-2 text-xl text-green-500'> 13/21 nft's claimed</p>
  </div>

  {/* {mint button} */}
  <button className='h-16 font-bold bg-red-600 w-full text-white rounded-full'>Mint NFT (0.01 MATIC)</button>
     
</div>


    </div>
  )
}

export default NFTDropPage

export const  getServerSideProps: GetServerSideProps = async({params}) => {

  const query = `*[_type == 'collection' && slug.current ==$id][0]
  {
    _id,
      title,
      address,
      nftCollectionName,
      mainImage{
      asset
      },
      previewImage{
      asset
      },
      slug{
      current
      },
      creator->{
        _id,
        name,
        address,
        slug
        {
          current
        }
      }
     
  }
  
  
  `
const collection = await sanityClient.fetch(query,{id:params?.id})
  if(!collection)
  {
    return{
      notFound:true
    }
  }

  return {
    props:{
      collection,

    }
  }

}