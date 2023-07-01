import { Tile, TileState } from './Tile'

const ROWS = 25
const COLS = 50

const EMPTY_COST = 5
const WALL_COST = 200
const BOMB_COST = 10
const DEST_COST = 20

export interface Node {
    row: number
    col: number
    dist: number
}

export class Pathfinder {
    private matrix: Tile[][]
    private rows: number
    private cols: number
    private distances: number[][]
    private parents: Node[][]
    private sequence: Node[]

    constructor() {
        const tiles: Tile[][] = []
        for (let j = 0; j < ROWS; j++) {
            const row: Tile[] = []
          
            for (let i = 0; i < COLS; i++) {
              if (j === ROWS / 2 + 1) {
                if (i === COLS * 0.1) {
                  row.push(new Tile(TileState.SRC, j, i, EMPTY_COST))
                }
                else if (i === COLS * 0.9) {
                  row.push(new Tile(TileState.DEST, j, i, DEST_COST))
                }
              }
              else {
              row.push(new Tile(TileState.EMPTY, j, i, EMPTY_COST))
            }
            }
            tiles.push(row)
          }
          this.matrix = tiles
            this.rows = ROWS
            this.cols = COLS
            this.distances = Array(this.rows).fill(null).map(() => Array(this.cols).fill(EMPTY_COST))
            this.parents = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null))
            this.sequence = []
    }

    public getMatrix(): Tile[][] {
        return this.matrix
    }

    public getParents(): Node[][] {
      return this.parents
    }

    public getDistances(): number[][] {
      return this.distances
    }

    private resetDistanceMatrix = (): void => {
      this.distances = Array(this.rows).fill(null).map(() => Array(this.cols).fill(1000))
    }

    private resetParentMatrix = (): void => {
      this.parents = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null))

    }

    public generateDistanceMatrix = (srcRow: number, srcCol: number, destRow: number, destCol: number) => {
      // for each vertex v in G.V:
        this.resetDistanceMatrix() // dist[v] = INFINITY
        this.resetParentMatrix() // prev[v] = UNDEFINED
        const queue: Node[] = [{ row: srcRow, col: srcCol, dist: 0 }] // add v to Q
        this.distances[srcRow][srcCol] = 0 // dist[src] = 0
        this.matrix[srcRow][srcCol].setTileState(TileState.SRC)
        this.matrix[destRow][destCol].setTileState(TileState.DEST)

        // update costs for walls and bombs
        this.setWeightedEdges()


        while (queue.length) { // while Q is not empty:
            const u = this.dequeue(queue) // u = extractMin(Q)
            const neighbors: Node[] = this.getNeighbors(u.row, u.col)
            for (const neighbor of neighbors) {
              if (!this.isValidCell(neighbor.row, neighbor.col))
                continue
              const alt = this.distances[u.row][u.col] + neighbor.dist // alt = dist[u] + G.E(u, v)
              if (alt < this.distances[neighbor.row][neighbor.col]) {
                this.distances[neighbor.row][neighbor.col] = alt
                this.parents[neighbor.row][neighbor.col] = u
                queue.push(neighbor)
              }
            }
        }
        return this.distances[destRow][destCol]
}

  public getSequence = (srcRow: number, srcCol: number, destRow: number, destCol: number) => {
    this.sequence.push({row: destRow, col: destCol, dist: 0})
    var parent = {row: -1, col: -1, dist: -1}
      const u = this.dequeue(this.sequence)
      console.log(`### ${parent.row} ${parent.col}`)
      parent = this.parents[u.row][u.col]
      this.sequence.push(parent)
    console.log(this.sequence)
  }

  private printDistancesMap = () => {
    for (let j = 0; j < ROWS; j++) {
      let s = ''
      for (let i = 0; i < COLS; i++) {
        s += (this.distances[j][i] + ' ')
      }
      console.log(s + '\n')
    }
  }

  private printParentsMap = () => {
    for (let j = 0; j < ROWS; j++) {
      let s = ''
      for (let i = 0; i < COLS; i++) {
        if (this.parents[j][i])
        s += (`${this.parents[j][i].row} ${this.parents[j][i].col} `)
      }
      console.log(s + '\n')
    }
  }

  private setDummyWallCosts = (): void => {
    this.matrix[8][30].setTileState(TileState.WALL)
    this.matrix[9][30].setTileState(TileState.WALL)
    this.matrix[10][30].setTileState(TileState.WALL)
    this.matrix[11][30].setTileState(TileState.WALL)
    this.matrix[12][30].setTileState(TileState.WALL)
    this.matrix[13][30].setTileState(TileState.WALL)
    this.matrix[14][30].setTileState(TileState.WALL)
    this.matrix[15][30].setTileState(TileState.WALL)

    this.matrix[8][12].setTileState(TileState.WALL)
    this.matrix[9][12].setTileState(TileState.WALL)
    this.matrix[10][12].setTileState(TileState.WALL)
    this.matrix[11][12].setTileState(TileState.WALL)
    this.matrix[12][12].setTileState(TileState.WALL)
    this.matrix[13][12].setTileState(TileState.WALL)
    this.matrix[14][12].setTileState(TileState.WALL)
    this.matrix[15][12].setTileState(TileState.WALL)
  }

private setWeightedEdges = (): void => {
  this.setDummyWallCosts()
    for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          if (this.matrix[row][col].getTileState() === TileState.WALL) {
            this.matrix[row][col].dist = WALL_COST
          }
          else if (this.matrix[row][col].getTileState() === TileState.BOMB) {
            this.matrix[row][col].dist = BOMB_COST
          }
        }
      }
}

    private dequeue(queue: Node[]): Node {
        queue.sort((a, b) => this.distances[a.row][a.col] - this.distances[b.row][b.col])
        return queue.shift()!
    }

    private isValidCell = (row: number, col: number): boolean => {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols
      }

    private getNeighbors = (row: number, col: number): Node[] => {
      const neighbors = []
      if (this.isValidCell(row-1, col))
        neighbors.push({ row: row - 1, col: col, dist: this.matrix[row - 1][col].dist }) // Up
      if (this.isValidCell(row+1, col))
        neighbors.push({ row: row + 1, col: col, dist: this.matrix[row + 1][col].dist })
      if (this.isValidCell(row, col-1))
        neighbors.push({ row: row, col: col - 1, dist: this.matrix[row][col - 1].dist })
      if (this.isValidCell(row, col+1))
        neighbors.push({ row: row, col: col + 1, dist: this.matrix[row][col + 1].dist })
        return neighbors
    }

    public setWall = (row: number, col: number): void => {
      console.log(row, col)
      const tile = this.matrix[row][col]
      this.matrix[row][col] = new Tile(TileState.WALL, tile.row, tile.col, WALL_COST)
    }
}