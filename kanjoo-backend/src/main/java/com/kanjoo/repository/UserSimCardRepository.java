package com.kanjoo.repository;

import com.kanjoo.entity.UserSimCard;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserSimCardRepository extends JpaRepository<UserSimCard, Long> {
    List<UserSimCard> findByUserOrderByIdAsc(User user);
    List<UserSimCard> findByUserIdOrderByIdAsc(Long userId);
}
