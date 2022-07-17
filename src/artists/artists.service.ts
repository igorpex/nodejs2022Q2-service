import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuid, validate, version } from 'uuid';

@Injectable()
export class ArtistsService {
  private artists: Array<Artist> = [];
  create(createArtistDto: CreateArtistDto) {
    // return 'This action adds a new artist';
    //check required fields and types
    const hasAllRequiredFields = createArtistDto.name && createArtistDto.grammy;
    const hasCorrectTypes =
      typeof createArtistDto.name === 'string' &&
      typeof createArtistDto.grammy === 'boolean';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, grammy should be boolean`,
      );
    }

    // create a artist with random id
    const newArtist = {
      id: uuid(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    // return `This action returns all artists`;
    return this.artists;
  }

  findOne(id: string) {
    // return `This action returns a #${id} artist`;
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`);
    }

    // Check artist exists
    const artist: Artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    // return `This action updates a #${id} artist`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`); //400
    }
    // Check artist exists
    const index: number = this.artists.findIndex((artist) => artist.id === id);
    // const artist: Artist = this.artists.find((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found.'); //404
    }

    //create updated artist
    const updatedArtist = {
      id: id,
      ...updateArtistDto,
    };
    this.artists[index] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    // return `This action removes a #${id} artist`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`); //400
    }
    // Check artist exists
    const artist: Artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found.'); //404
    }
    this.artists = this.artists.filter((artist) => artist.id !== id);
    return;
  }
}
