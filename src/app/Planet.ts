namespace SpaceTraders
{
    export class Planet
    {
        public m_Name: string;
        public m_Position: THREE.Vector3;
        public m_Size: number;
        public m_Color: THREE.Color;

        private m_Mesh: THREE.Mesh;
        private m_CollisionVolume: THREE.Sphere;

        public constructor(jsonObj: any)
        {
            this.m_Name = jsonObj.name;
            this.m_Position = new THREE.Vector3(jsonObj.position.x, jsonObj.position.y, jsonObj.position.z);
            this.m_Size = jsonObj.size;
            this.m_Color = new THREE.Color(parseInt(jsonObj.color));
        }

        public Init()
        {
            // Initialize visuals
            const geometry = new THREE.SphereGeometry( this.m_Size, 32, 32 );
            const material = new THREE.MeshPhongMaterial( {color: this.m_Color} );
            const sphere = new THREE.Mesh( geometry, material );
            sphere.position.set(this.m_Position.x, this.m_Position.y, this.m_Position.z);
            
            SceneRenderer.Instance.AddToScene(sphere);
            
            // Create a bounding sphere for collision detection
            this.m_CollisionVolume = new THREE.Sphere(this.m_Position, this.m_Size);
        }

        public Pick(cursorX: number, cursorY: number) : boolean
        {
            let displayPos = new THREE.Vector2(cursorX, cursorY);
            var clipPoint = SceneRenderer.Instance.DisplayToClipPos(displayPos);
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(clipPoint, SceneRenderer.Instance.Camera);
            return raycaster.ray.intersectsSphere(this.m_CollisionVolume);
        }
    }
}