interface IProps{
    cloudName:string,
    publicId:string,
    transformations:string
}
export default function getImageUrl({ cloudName, publicId, transformations }: IProps) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;
}
  