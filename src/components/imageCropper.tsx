'use client'
import React, {ChangeEvent, useState} from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import {centerCrop, Crop, makeAspectCrop, ReactCrop} from "react-image-crop";

const ASPECT_RATIO = 1;
const MIN_WIDTH = 450;

function ImageCropper() {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>();
    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageUrl = reader.result?.toString() || '';
            setImageSrc(imageUrl);
        })
        reader.readAsDataURL(file)
    }
    const onImageLoad = (e: ChangeEvent<HTMLImageElement>) => {
        const {width, height} = e.currentTarget

        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                ASPECT_RATIO,
                width,
                height
            ),
            width,
            height
        )

        setCrop(crop)
    }
    return (
        <>
            <label>
                <span>Subir foto</span>
                <input
                    onChange={onSelectFile}
                    type={"file"}
                    accept={'image/*'}
                />
            </label>
            {
                imageSrc &&
                <div className={'flex flex-col items-center'}>
                    <ReactCrop
                        keepSelection
                        onChange={(pixelCrop, percentageCrop) => setCrop(percentageCrop)}
                        crop={crop}
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_WIDTH}>
                        <img
                            src={imageSrc}
                            alt={'upload'}
                            className={'w-max-[450px]'}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </div>
            }
        </>
    );
}

export default ImageCropper;