'use client';

import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import {centerCrop, Crop, makeAspectCrop, ReactCrop} from 'react-image-crop';
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from '@nextui-org/modal';
import {Button} from "@nextui-org/button";
import {twMerge} from 'tailwind-merge';
import {Card} from "@nextui-org/card";
import {cn} from "@/lib/utils";

const ASPECT_RATIO = 1;
const MAX_SIZE = 400;

interface ImageUploaderWithEditorProps {
    name: string;
    className?: {
        wrapper?: string;
    }
    onChange?: (file: File | null) => void;
    accept?: string;
}

const createPaddedImage = (imageSrc: string, callback: (dataUrl: string) => void) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const xOffset = (MAX_SIZE - image.width) / 2;
            const yOffset = (MAX_SIZE - image.height) / 2;

            ctx.drawImage(image, xOffset, yOffset, image.width, image.height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            callback(dataUrl);
        }
    };
};

const ImageUploaderWithEditor: React.FC<ImageUploaderWithEditorProps> = ({
                                                                             onChange,
                                                                             accept = 'image/*',
                                                                             name,
                                                                             className
                                                                         }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop | null>(null);
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const createCanvasPreview = (image: HTMLImageElement, crop: Crop | null) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, MAX_SIZE, MAX_SIZE);

            const xOffset = (MAX_SIZE - image.width) / 2;
            const yOffset = (MAX_SIZE - image.height) / 2;

            ctx.drawImage(image, xOffset, yOffset, image.width, image.height);

            const base64Image = canvas.toDataURL('image/jpeg');
            setPreviewUrl(base64Image);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            createPaddedImage(reader.result as string, setPreviewUrl);
            if (onChange) {
                onChange(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            createPaddedImage(reader.result as string, setPreviewUrl);
            if (onChange) {
                onChange(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragEnter = (e: React.DragEvent) => e.preventDefault();
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDragLeave = (e: React.DragEvent) => e.preventDefault();

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const {width, height} = e.currentTarget;
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
        );
        setCrop(crop);

        createCanvasPreview(e.currentTarget, crop);
    };

    const handleSaveCroppedImage = () => {
        if (!completedCrop || !imageSrc || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

            const x = completedCrop.x * scaleX;
            const y = completedCrop.y * scaleY;
            const width = completedCrop.width * scaleX;
            const height = completedCrop.height * scaleY;

            const xOffset = (MAX_SIZE - width) / 2;
            const yOffset = (MAX_SIZE - height) / 2;

            ctx.drawImage(
                imgRef.current,
                x,
                y,
                width,
                height,
                xOffset,
                yOffset,
                width,
                height
            );

            const base64Image = canvas.toDataURL('image/jpeg');
            setPreviewUrl(base64Image);

            if (onChange) {
                fetch(base64Image)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'edited-image.jpg', {type: 'image/jpeg'});
                        onChange(file);
                    });
            }
        }
    };

    const onBoxClick = () => {
        inputRef.current?.click();
    };

    useEffect(() => {
        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                if (img.width < MAX_SIZE || img.height < MAX_SIZE) {
                    createCanvasPreview(img, crop);
                }
            };
        }
    }, [imageSrc, crop]);

    return (
        <div className={cn("flex flex-col items-center", className?.wrapper)}>
            <Card
                isPressable
                className={twMerge(
                    'relative flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-md',
                    previewUrl ? 'border-blue-400' : 'border-gray-400'
                )}
                onClick={onBoxClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain"/>
                ) : (
                    <p className="text-center">Arrastra una imagen o haz clic para seleccionar</p>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </Card>

            {previewUrl && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button color="danger" onPress={() => {
                        setPreviewUrl(null);
                        if (onChange) onChange(null);
                    }}>
                        Borrar imagen
                    </Button>
                    <Button color="primary" onPress={onOpen}>
                        Editar imagen
                    </Button>
                </div>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Editar imagen</ModalHeader>
                            <ModalBody>
                                {imageSrc && (
                                    <ReactCrop
                                        //@ts-ignore
                                        crop={crop}
                                        onChange={(_, percentageCrop) => setCrop(percentageCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={ASPECT_RATIO}
                                    >
                                        <img ref={imgRef} src={imageSrc} alt="Cargar" onLoad={onImageLoad}/>
                                    </ReactCrop>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onPress={() => {
                                        handleSaveCroppedImage();
                                        onClose();
                                    }}
                                >
                                    Guardar Cambios
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ImageUploaderWithEditor;