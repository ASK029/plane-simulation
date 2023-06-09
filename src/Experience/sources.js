export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "/environment/5/px.png",
      "/environment/5/nx.png",
      "/environment/5/py.png",
      "/environment/5/ny.png",
      "/environment/5/pz.png",
      "/environment/5/nz.png",
    ],
  },
  {
    name: "skyMapTexture",
    type: "cubeTexture",
    path: [
      "/environment/3/px.png",
      "/environment/3/nx.png",
      "/environment/3/py.png",
      "/environment/3/ny.png",
      "/environment/3/pz.png",
      "/environment/3/nz.png",
    ],
  },
  {
    name: "roadColorTexture",
    type: "texture",
    path: "textures/1/black-road-texture.jpg",
  },
  {
    name: "roadNormalTexture",
    type: "texture",
    path: "textures/1/black-road-texture-normal.jpg",
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/2/grass-texture.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/2/grass-texture-normal.jpg",
  },
  {
    name: "airplaneModel",
    type: "gltfModel",
    path: "models/myAirplane2.glb",
  },
];
