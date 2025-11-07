import { gql } from 'graphql-tag'

const typeDefs = gql`

    type Message {
            id: ID
            name: String
            phone: String
            email: String
            message: String
            creado: String
    }

    type Product {
        id: ID
        idString: String
        name: String
        description: String
        tipo: TipoProducto
        fijacion: String
        aroma: String
        efecto: String
        imagen: String
    }

    enum TipoProducto {
        CERA
        POMADA
        AFTERSHAVE
        ACEITE BARBA
        TEXTURIZADOR
    }

    input MessageInput {
        name: String!
        phone: String!
        email: String!
        message: String!
    }

    input ProductInput {
        name: String!
        description: String!
        tipo: TipoProducto!
        fijacion: String
        aroma: String
        efecto: String
        imagen: String!
    }

    type Query {
        #Messages
        obtenerMensajes: [Message]

        #Products
        obtenerProductos: [Product]
        obtenerProducto(id: ID!): Product
    }

    type Mutation {
        #Messages
        crearMensaje(input: MessageInput!) : Message

        #Products
        crearProducto(input: ProductInput!): Product
    }





`

export default typeDefs;
